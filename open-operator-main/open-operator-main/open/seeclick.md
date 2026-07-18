# SeeClick

## Overview
SeeClick is an open-source visual GUI agent developed by Nanjing University & Shanghai AI Lab, focusing on GUI grounding and interaction. The project is described in their [ACL 2024 paper](https://arxiv.org/abs/2401.10935) and available on [GitHub](https://github.com/njucckevin/SeeClick).

## Key Features
- GUI grounding pre-training
- Visual interaction focus
- Built on Qwen-VL
- Extensive evaluation benchmark (ScreenSpot)
- Joint development by academic institutions

## Performance
### OSWorld Results
- SeeClick w/ GPT-4o: 9.21%

### ScreenSpot Results
- Mobile Text: 78.0% accuracy
- Mobile Icon/Widget: 52.0% accuracy
- Desktop Text: 72.2% accuracy
- Desktop Icon/Widget: 30.0% accuracy
- Web Text: 55.7% accuracy
- Web Icon/Widget: 32.5% accuracy
- Overall Average: 53.4% accuracy

## Technical Details
- Base Model: Qwen-VL with 9.6B parameters
- Focus: GUI grounding and visual interaction
- Specialized in click-based interactions
- Supports multiple platforms (iOS, Android, macOS, Windows, Web)
- Includes pre-training on web GUI corpus

## References
- Paper: https://arxiv.org/abs/2401.10935
- Code: https://github.com/njucckevin/SeeClick
- Model: https://huggingface.co/cckevinn/SeeClick
- Benchmark: ScreenSpot evaluation suite