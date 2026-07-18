# UI-TARS

## Overview
UI-TARS is an open-source autonomous GUI agent developed by ByteDance Seed & Tsinghua University. The project is described in their [research paper](https://arxiv.org/abs/2501.12326) and available on [GitHub](https://github.com/bytedance/UI-TARS).

## Key Features
- Multiple model sizes (2B, 7B, and 72B)
- DPO and SFT training approaches
- Support for varying step lengths
- Cross-platform support (desktop, mobile, web)
- Built on Qwen-2-VL architecture

## Performance
### OSWorld Results
- UI-TARS-72B-DPO (50 steps): 24.6% (best overall)
- UI-TARS-72B-DPO (15 steps): 22.7%
- UI-TARS-72B-SFT (15 steps): 18.8%
- UI-TARS-7B-DPO (15 steps): 18.7%
- UI-TARS-7B-SFT (15 steps): 17.7%

### ScreenSpot Results
- UI-TARS-72B: 88.4% accuracy
- UI-TARS-7B: 89.5% accuracy
- UI-TARS-2B: 82.3% accuracy

## Technical Details
- Model Sizes: 2B, 7B, and 72B parameters
- Training Methods: DPO and SFT
- Input: Pure vision-based approach
- Step Configurations: 15 and 50 steps
- Supports local deployment with vLLM

## References
- Paper: https://arxiv.org/abs/2501.12326
- Code: https://github.com/bytedance/UI-TARS
- Desktop Version: https://github.com/bytedance/UI-TARS-desktop
- Models: https://huggingface.co/bytedance-research/UI-TARS-7B-DPO