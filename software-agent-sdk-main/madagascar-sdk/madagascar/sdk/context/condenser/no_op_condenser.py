from madagascar.sdk.context.condenser.base import CondenserBase
from madagascar.sdk.context.view import View
from madagascar.sdk.event.condenser import Condensation
from madagascar.sdk.llm import LLM


class NoOpCondenser(CondenserBase):
    """Simple condenser that returns a view un-manipulated.

    Primarily intended for testing purposes.
    """

    def condense(self, view: View, agent_llm: LLM | None = None) -> View | Condensation:  # noqa: ARG002
        return view
