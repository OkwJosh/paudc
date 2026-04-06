from enum import Enum

class ParticipantRole(str, Enum):
    DEBATER = "debater"
    ADJUDICATOR = "adjudicator"
    OBSERVER = "observer"
    ORGANIZER = "organizer"

    def __str__(self):
        return self.value

class Status(str, Enum):
    PENDING = "pending"
    # Note: Add other status values here as needed (e.g., APPROVED, REJECTED)

    def __str__(self):
        return self.value

    def __repr__(self):
        return f"<{self.__class__.__name__}.{self.name}: '{self.value}'>"

    @classmethod
    def _missing_(cls, value: any) -> any:
        """
        Handle missing enum values by trying to match against string values.
        This allows for more flexible enum creation from strings.
        """
        if isinstance(value, str):
            for member in cls:
                if member.value == value:
                    return member
        return None