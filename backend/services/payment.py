import logging
from typing import Dict, Any, Optional, Tuple, Literal
from pydantic import BaseModel, Field, model_validator
import stripe

from core.config import settings

logger = logging.getLogger(__name__)

class CheckoutSessionRequest(BaseModel):
    """Request model for creating a checkout session"""
    quantity: int = Field(description="The quantity of items to purchase")
    mode: Literal["payment", "subscription"] = Field(default="payment", description="Checkout mode")
    ui_mode: Literal["hosted", "embedded"] = Field(default="hosted", description="Checkout UI mode")
    return_url: Optional[str] = Field(
        None, description="For embedded Checkout: URL to return to; must include {CHECKOUT_SESSION_ID}"
    )
    success_url: Optional[str] = Field(
        None, description="For hosted Checkout: URL to redirect after success; must include {CHECKOUT_SESSION_ID}"
    )
    cancel_url: Optional[str] = Field(
        None, description="For hosted Checkout: URL to redirect after cancellation"
    )
    metadata: Optional[Dict[str, str]] = Field(None, description="Additional metadata to store with the session")
    idempotency_key: Optional[str] = Field(None, description="Idempotency key to avoid duplicate sessions")

    @model_validator(mode='after')
    def validate_urls(self):
        if self.ui_mode == "embedded":
            if not self.return_url:
                raise ValueError("return_url is required when ui_mode='embedded'")
        else:
            if not self.success_url or not self.cancel_url:
                raise ValueError("success_url and cancel_url are required when ui_mode='hosted'")
        return self

def _classify_stripe_error(e: stripe.StripeError) -> Tuple[str, bool, str]:
    """Classify Stripe error and return error type, retryable, and fix suggestion."""
    error_type = "unknown_error"
    is_retryable = False
    fix_suggestion = "Check application logs and system configuration"
    
    if isinstance(e, stripe.AuthenticationError):
        error_type = "authentication"
        fix_suggestion = "Check if STRIPE_SECRET_KEY in environment variables or settings is correct"
    elif isinstance(e, stripe.RateLimitError):
        error_type = "rate_limit"
        is_retryable = True
        fix_suggestion = "Wait and retry after rate limit resets"
    elif isinstance(e, stripe.InvalidRequestError):
        error_type = "invalid_request"
        fix_suggestion = "Review request parameters and fix invalid values"
    elif isinstance(e, stripe.APIConnectionError):
        error_type = "network"
        is_retryable = True
        fix_suggestion = "Check network connection and retry"
        
    return error_type, is_retryable, fix_suggestion


class PaymentService:
    """Payment service class, handles Stripe integration"""
    
    @staticmethod
    async def create_checkout_session(request: CheckoutSessionRequest) -> Dict[str, Any]:
        """Create a Stripe checkout session for a payment."""
        if not settings.stripe_api_key:
            raise ValueError("Stripe API key not configured")
            
        stripe.api_key = settings.stripe_api_key
        
        try:
            params = {
                "payment_method_types": ["card"],
                "mode": request.mode,
                "ui_mode": request.ui_mode,
            }
            
            if request.metadata:
                params["metadata"] = request.metadata
                
            if request.ui_mode == "embedded":
                params["return_url"] = request.return_url
            else:
                params["success_url"] = request.success_url
                params["cancel_url"] = request.cancel_url
                
            # Create session (Uses async stripe integration if applicable, otherwise wrapped)
            session = stripe.checkout.Session.create(**params)
            
            return {
                "id": session.id,
                "client_secret": session.client_secret,
                "url": session.url
            }
            
        except stripe.StripeError as e:
            error_type, is_retryable, fix_suggestion = _classify_stripe_error(e)
            logger.error(f"Stripe error during session creation: {str(e)}")
            raise ValueError(f"Payment provider error: {error_type}")