这里的技能放在 harness/skills/，与存放角色说明的 harness/agents/ 并列；由 Harness 按路径显式加载，不依赖运行器自动发现。各角色只读取当前步骤需要的入口。

- [bug-detect](bug-detect/SKILL.md)：reviewer 发现缺陷或复验修复时使用，查询并去重项目错误知识库。
- [feature-plan](feature-plan/SKILL.md)：任务规划家在第 1、2、4、5 步访谈与调研、定功能与栈、核对项目方案或拆 Plan。
- [subagent-driven-execution](subagent-driven-execution/SKILL.md)：计划获批且实施获准后，逐项派工、审查与验收。
- [tech-stack-plan](tech-stack-plan/SKILL.md)：技术栈尚未确定时，协助用户选择并记录技术栈与架构约束。
- [UIUX-design](UIUX-design/SKILL.md) 由交互规划家按用户委托从任务路径到关键页面、用户反馈和开发交接。入口按问题指向专项资料及精选素材。

从 harness 或独立代码仓库启动，都按 Harness 入口显式读取技能。其余技能即使被运行器发现，也须满足各自前提；UIUX-design 直接读 SKILL.md，不依赖自动发现。
