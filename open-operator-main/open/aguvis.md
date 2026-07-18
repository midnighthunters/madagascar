# Aguvis

## Overview
Aguvis is an open-source multimodal agent system developed by Salesforce & The University of Hong Kong that combines screenshot and accessibility tree information. The project is [officially hosted](https://aguvis-project.github.io/) and described in their [research paper](https://arxiv.org/abs/2412.04454).

## Key Features
- Multimodal approach (screenshot + a11y tree)
- Integration with GPT-4o
- Multiple model variants (7B and 72B)
- Joint development by Salesforce and HKU

## Performance
### OSWorld Results
- Aguvis-72B w/ GPT-4o: 17.04%
- Aguvis-72B: 10.26%

### WebArena Results
- Aguvis-72B: 89.2% accuracy
- Aguvis-7B: 84.4% accuracy

## Technical Details
- Model Size: Available in 7B and 72B parameters
- Input: Combined screenshot and accessibility tree
- Optional GPT-4o integration
- Focus on multimodal understanding
- Pure vision-based framework for GUI interaction

## References
- Project: https://aguvis-project.github.io/
- Paper: https://arxiv.org/abs/2412.04454
- Code: https://github.com/xlang-ai/aguvis