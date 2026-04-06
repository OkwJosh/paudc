# import stripe
# import logging
# from fastapi import APIRouter, Depends, HTTPException, Request, status
# from sqlalchemy.ext.asyncio import AsyncSession

# from core.database import get_db
# from core.config import settings
# from dependencies.auth import get_current_user
# from models.auth import User
# from services.registrations import RegistrationsService
# from services.payments import PaymentService

# logger = logging.getLogger(__name__)

# router = APIRouter(prefix="/api/v1/payments", tags=["payments"])

# @router.post("/checkout/{registration_id}")
# async def initiate_checkout(
#     registration_id: int,
#     current_user: User = Depends(get_current_user),
#     db: AsyncSession = Depends(get_db)
# ):
#     """Generate a Stripe Checkout URL for a specific registration."""
#     reg_service = RegistrationsService(db)
#     registration = await reg_service.get_by_id(registration_id)
    
#     if not registration:
#         raise HTTPException(status_code=404, detail="Registration not found")
        
#     # Ensure users can only pay for their own registrations (unless admin)
#     if registration.user_id != str(current_user.id) and current_user.role != "admin":
#         raise HTTPException(status_code=403, detail="Not authorized to pay for this registration")

#     payment_service = PaymentService(db)
#     try:
#         checkout_url = await payment_service.create_checkout_session(registration)
        
#         # Optional: Update status to 'payment_pending' here
#         await reg_service.update(registration_id, {"status": "payment_pending"}, user_id=str(current_user.id))
        
#         return {"checkout_url": checkout_url}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Failed to initialize payment gateway")


# @router.post("/webhook", include_in_schema=False)
# async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
#     """Stripe Webhook to listen for successful payments."""
#     payload = await request.body()
#     sig_header = request.headers.get("stripe-signature")
    
#     if not settings.stripe_webhook_secret:
#         logger.error("Stripe webhook secret is not configured.")
#         raise HTTPException(status_code=500, detail="Server misconfiguration")

#     try:
#         # Verify the event came from Stripe
#         event = stripe.Webhook.construct_event(
#             payload, sig_header, settings.stripe_webhook_secret
#         )
#     except ValueError as e:
#         # Invalid payload
#         raise HTTPException(status_code=400, detail="Invalid payload")
#     except stripe.error.SignatureVerificationError as e:
#         # Invalid signature
#         raise HTTPException(status_code=400, detail="Invalid signature")

#     # Handle the checkout.session.completed event
#     if event['type'] == 'checkout.session.completed':
#         session = event['data']['object']
        
#         # Grab the registration ID we passed in earlier
#         client_reference_id = session.get('client_reference_id')
        
#         if client_reference_id:
#             payment_service = PaymentService(db)
#             await payment_service.mark_registration_paid(int(client_reference_id))

#     # Stripe requires a 200 response to acknowledge receipt
#     return {"status": "success"}