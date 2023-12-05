# Contributing

## Docs

- [えしし(松岡) – Notion](https://www.notion.so/1754996a543745b2bed41b88494d7c12)
- [UIデザイン – Figma](https://www.figma.com/files/project/114437348/%E3%83%81%E3%83%BC%E3%83%A0%E3%81%AE%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88?fuid=1216739251660375899)

## Branch

[GitHub-flow](https://docs.github.com/ja/get-started/quickstart/github-flow)を採用

| ブランチ名 |         用途         | ブランチ元 | マージ先 |
| :--------: | :------------------: | :--------: | :------: |
|   `main`   |                      |   `main`   |  `main`  |
|  `feat/*`  | 機能追加(テスト含む) |   `main`   |  `main`  |
|  `docs/*`  |    ドキュメント類    |   `main`   |  `main`  |


## Commit
```bash
# 例: 機能に関するコミット
git commit -m 'feat(機能名): 変更内容'
```

コミットメッセージのフォーマットは [conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint) の`README.md`を参照すること。
[Husky](https://typicode.github.io/husky/)により自動で検証される。

## Pull Request
`main`ブランチヘのマージは、必ずPull Requestを使用すること
## Directory Architecture

### root

| path             | 用途           |
| ---------------- | -------------- |
| `share/`         | ライブラリ     |
| `apps/frontend/` | フロント       |
| `apps/api/`      | バックエンド   |
| `apps/ai/`       | AI             |
| `infra/`         | インフラ側など |


### frontend
[Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) を採用

| path             | レイヤー  |
| ---------------- | --------- |
| `src/atoms/`     | atoms     |
| `src/molecules/` | molecules |
| `src/organisms/` | organisms |
| `src/templates/` | templates |
| `src/pages/`     | pages     |


### api
[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) を採用

| path                     | レイヤー                   |
| ------------------------ | -------------------------- |
| `src/frameworks/`        | Frameworks & Drivers       |
| `src/interface-adapter/` | Interface adapter          |
| `src/usecase/`           | Application Business Rules |
| `src/domain/`            | Enterprise Business Rules  |

## Lint

[Husky](https://typicode.github.io/husky/)によりコミット時に自動でフォーマットが実行される。

### TypeScript

[ESLint](https://eslint.org)
[Prettier](https://prettier.io)

### Rust

[Clippy](https://github.com/rust-lang/rust-clippy)

### Python
[black](https://github.com/psf/black)
[pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance)
[flake8](https://flake8.pycqa.org/en/latest/)



## Unit test

### TypeScript
[Jest](https://jestjs.io/ja/)を採用
コード例は[こちら](https://basarat.gitbook.io/typescript/intro-1/jest)

### Python
[pytest](https://docs.pytest.org/en/7.4.x/)を採用

## Package manager
- [poetry](https://python-poetry.org)
- [Yarn](https://yarnpkg.com)
- [Cargo](https://doc.rust-lang.org/cargo/)
