# OSWorld

OSWorld is a first-of-its-kind scalable, real computer environment for multimodal agents, supporting task setup, execution-based evaluation, and interactive learning across operating systems.

## Key Features

- Scalable computer environment supporting multiple operating systems (Ubuntu, Windows, macOS)
- Unified environment for evaluating open-ended computer tasks
- Supports arbitrary applications and cross-app workflows
- Includes 369 real-world computer tasks with reliable setup and evaluation scripts
- Enables interactive learning and evaluation

## Performance Metrics

Latest benchmark results as of April 2024:

### Overall Performance
- Human Performance: >72.36% task success rate
- Best Model Performance: 24.6% (UI-TARS-72B-DPO with 50 steps)
- Models primarily struggle with GUI grounding and operational knowledge

### Detailed Results by Model Type

#### A11y Tree Based Models
| Rank | Model | Success Rate | Notes |
|------|--------|--------------|-------|
| 1 | UI-TARS-72B-DPO (50 steps) | 24.6% | ByteDance & Tsinghua |
| 2 | UI-TARS-72B-DPO (15 steps) | 22.7% | ByteDance & Tsinghua |
| 3 | Claude 3.5 Sonnet (50 steps) | 22.0% | Anthropic |
| 4 | UI-TARS-72B-SFT (15 steps) | 18.8% | ByteDance & Tsinghua |
| 5 | UI-TARS-7B-DPO (15 steps) | 18.7% | ByteDance & Tsinghua |

#### Screenshot Based Models
| Rank | Model | Success Rate | Notes |
|------|--------|--------------|-------|
| 1 | OSCAR w/ GPT-4o | 24.5% | Universite de Montreal |
| 2 | GPT-4 Vision | 11.77% | OpenAI |
| 3 | GPT-4 Vision (0409) | 8.40% | OpenAI |
| 4 | Gemini-Pro-1.5 | 7.79% | Google |
| 5 | Claude-3-Opus | 6.72% | Anthropic |

#### Screenshot + A11y Tree Models
| Rank | Model | Success Rate | Notes |
|------|--------|--------------|-------|
| 1 | Aguvis-72B w/ GPT-4o | 17.04% | Salesforce & HKU |
| 2 | Aria-UI w/ GPT-4o | 15.15% | HKU & Rhymes AI |
| 3 | OS-Atlas-Base-7B w/ GPT-4o | 14.63% | Shanghai AI Lab |
| 4 | Aguvis-72B | 10.26% | Salesforce & HKU |
| 5 | SeeClick w/ GPT-4o | 9.21% | Nanjing University |

### Key Findings
- Higher screenshot resolution improves performance
- Longer text-based trajectory history helps but poses efficiency challenges
- Current VLM agents are not robust to UI layout and noise
- Performance across different OS shows strong correlation

## Task Categories

Tasks span multiple domains including:
- Web applications
- Desktop applications
- OS file I/O operations
- Cross-application workflows
- Real-world use cases

## Technical Infrastructure

- Uses configuration files for task initialization
- Supports agent interaction and post-processing
- Enables file and information retrieval
- Includes execution-based evaluation functions
- Supports parallel environment execution
- Enables headless operation

## Key Statistics

- Total tasks: 369 (plus 43 additional Windows-based tasks)
- Execution-based evaluation functions: 134
- Supports intermediate initialization states
- Enables multimodal interaction
- Allows cross-app task execution

## References

- Paper: https://arxiv.org/abs/2404.07972
- Website: https://os-world.github.io/
- Code: https://github.com/xlang-ai/OSWorld
- Documentation: https://timothyxxx.github.io/OSWorld/