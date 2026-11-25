# Project 区

code 保存软件本体、运行资源及必要配置；installpark 只存获准生成的最终 ZIP。只有用户明确要求打包，或当前实施授权覆盖打包项时才执行。测试、辅助工具和数据默认放 test；边界见 Harness 的 ARCHITECTURE.md。

接入已有项目时，在 Harness 的 `docs/paths.md` 将 `project/code` 映射到实际代码根，无需移动仓库或改名为 `code`。保留既有测试；确需维持的固定目录冲突按架构规则确认和登记，新增材料仍按默认边界存放。
