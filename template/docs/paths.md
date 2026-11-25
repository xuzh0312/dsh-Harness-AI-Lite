# 热路径：工作区域与当前入口

当前写入者：无（写入规则见 [AGENTS.md](../AGENTS.md#写入授权与验收)）

| 区域 | 实际绝对路径 | 用途 |
| --- | --- | --- |
| harness | @@ | 项目规则、介绍、计划与角色 |
| project | @@ | `installpark` 与默认的 `code` 所在区域 |
| project/code | @@ | 新项目默认用 `project` 下的 `code`；已有项目可指向现有代码根 |
| test | @@ | 测试及辅助代码、数据、日志、缓存与验证产物 |

各角色从这里获取实际位置，不假定三个区域同盘或相邻。`project/code` 是 project 区的逻辑代码根，不要求迁移已有仓库，也不增加工作区域。在本 DSH 工作区中，会话工作目录为 `harness`。访问其他区域时按本表使用实际路径，执行命令时明确命令的工作目录，并核对实际访问权限。移动目录后更新本表。用户确认的必要固定目录例外在此登记：所属根、稳定相对目录、原因与适用范围；没有例外时不填。

## 当前工作（在项目副本中填写）

| 功能编号与范围 | 当前入口（区域根 + 相对路径） | 本步还需要的有效基线／证据位置 |
| --- | --- | --- |

只登记真实存在的入口；没有活动工作就留空。不同功能各用一行，同一功能可指向本步所需的两份记录。交接细节、版本、用户批准和下一步以文件开头为准，不在这里另建进度账。拟建路径和未采用的候选不列入树。非敏感别名可替代敏感名称。

## 热冷切换

- 新会话先看本表，按用户指向的目标取当前文件及必要上游；不为找进度递归扫描工作区、completed、原始日志或[冷路径清单](paths-cold.md)。下方目录树用于定位模板入口，不是必读清单。
- 当前工作仍依赖的方案、批准用稿、回归基线、测试证据保留热引用，即使来源功能已完成。结束、取消、替代且无活跃依赖时，仅将其索引从热表转到冷表，记清归属、位置、版本、原因及仍需保留的引用。先核实冷条目再撤热引用；不中断证据链，不由此移动或删除实际文件。规定的 Plan/TASK 归档是另一动作。
- 仅为指定回溯、复验、恢复或用户要求清理时按编号查冷表，再打开必要的具体材料。重启旧功能先核对版本、实际文件与权限，重新需要的引用转热，旧批准或取消的授权不自动恢复。清理前另核依赖、保留义务、可恢复性与用户对具体范围的授权。
- 热入口因归档中断而失效时，按已知 PLAN／TASK 编号精确核对 `docs/plans/active/` 和 `docs/plans/completed/` 下的同名文件，不扫冷库。只有一份，且版本与终态／在途状态可核实，才在授权内补齐方案链接和索引；两处都有、都没有或状态不符就先问用户，不重建记录、不恢复旧授权。
- 子 agent 只报告结构变化；当前负责的对话角色串行更新索引。写前重读、合并其他功能的行；未确认上个写入者停写或无法排除覆盖时先交接。无权限则在回复给实际位置及待同步项。开始、恢复和验收核对本次影响的路径及根映射，标明未核对区域；不因此扫描冷档。
- 目录树只收录本版三域已存在的稳定入口。移动根、增删稳定目录或改变固定目录例外时同步；原始数据和临时输出不逐文件建树。证据按区域根、相对位置和版本引用。结构变动由当前角色按实际情况更新，无后台监听。

## 三个区域的稳定路径索引

### harness

```text
harness/
├── skills/
│   ├── bug-detect/
│   │   └── SKILL.md
│   ├── feature-plan/
│   │   └── SKILL.md
│   ├── subagent-driven-execution/
│   │   └── SKILL.md
│   ├── tech-stack-plan/
│   │   └── SKILL.md
│   ├── UIUX-design/
│   │   ├── SKILL.md
│   │   ├── assets/
│   │   │   ├── index.md
│   │   │   └── UI技法图鉴/
│   │   └── references/
│   │       ├── interaction-motion.md
│   │       ├── tasks-navigation.md
│   │       ├── creative-direction.md
│   │       ├── copy-and-states.md
│   │       └── visual-hierarchy.md
│   └── README.md
├── agents/
│   ├── execution-coordinator/
│   │   └── AGENT.md
│   ├── implementer/
│   │   └── AGENT.md
│   ├── interaction-planner/
│   │   └── AGENT.md
│   ├── task-planner/
│   │   └── AGENT.md
│   ├── reviewer/
│   │   └── AGENT.md
│   ├── MODELS.md
│   ├── README.md
│   └── TASK_TEMPLATE.md
├── docs/
│   ├── decisions/
│   │   └── README.md
│   ├── plans/
│   │   ├── active/
│   │   │   └── .gitkeep
│   │   ├── completed/
│   │   │   └── .gitkeep
│   │   ├── README.md
│   │   └── TEMPLATE.md
│   ├── runbooks/
│   │   ├── execution.md
│   │   ├── README.md
│   │   └── start-task-template.md
│   ├── specs/
│   │   ├── README.md
│   │   └── TEMPLATE.md
│   ├── bugs.md
│   ├── paths-cold.md
│   ├── paths.md
│   └── tech-debt.md
├── AGENTS.md
├── ARCHITECTURE.md
└── README.md
```

### project

```text
project/
├── code/
│   └── README.md
├── installpark/
│   └── README.md
└── README.md
```

`installpark/` 存在且为空时才补写其 README。

### test

```text
test/
└── README.md
```
