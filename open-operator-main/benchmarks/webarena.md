# WebArena

WebArena is a realistic web environment for building autonomous agents. It creates websites from popular categories with functionality and data mimicking their real-world equivalents.

## Key Features

- Standalone, self-hostable web environment for building autonomous agents
- Creates websites from four popular categories with realistic functionality
- Embeds tools and knowledge resources as independent websites
- Provides annotated programs for programmatically validating task correctness
- Supports task setup and execution-based evaluation

## Performance Metrics

Latest leaderboard results as of April 2024:

| Rank | Model | Success Rate | Type | Notes |
|------|--------|--------------|------|-------|
| 1 | Jace.AI | 57.1% | Closed | Action description + Screenshots |
| 2 | ScribeAgent + GPT-4o | 53.0% | Closed | Finetuned with proprietary data |
| 3 | ORCHESTRA | 52.1% | Closed | Reported by UNC x Ventus |
| 4 | Learn-by-Interact | 48.0% | Open | Best open-source solution |
| 5 | AgentOccam-Judge | 45.7% | Open | |

### Evaluation Methods
- Information seeking tasks with answer comparison
- Programmatic checking of intermediate states
- GUI-only interface testing
- Cross-app workflow validation

## Task Categories

WebArena includes tasks across various domains including:
- Web navigation
- Online shopping
- Table booking
- Information seeking
- Multi-step workflows

## Technical Details

- Provides a controlled web environment
- Supports multimodal agent evaluation
- Enables cross-app interactions
- Allows starting tasks from intermediate states
- Includes execution-based evaluation functions

## References

- Paper: https://arxiv.org/pdf/2307.13854
- Website: https://webarena.dev
- Code: https://github.com/web-arena-x/webarena