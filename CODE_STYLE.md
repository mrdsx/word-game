# Code style

## Essential rules

- Prefer readability over cleverness.
- Avoid deeply nested code.
- Give things explicit names.
- Stick with single responsibility principle.
- Handle errors properly.

---

## Project structure

- `/frontend` – Svelte app.
- `/backend` – FastAPI app.
- `/firebase` – firebase emulators config.

---

## Naming conventions

### Git

- Branches: semantic prefix + kebab-case (e. g., feat/auth, fix/online-game).

### Frontend

| Type                           | Convention       |
| ------------------------------ | ---------------- |
| Folders                        | kebab-case       |
| TS Files, Variables, Functions | camelCase        |
| Components, Classes            | PascalCase       |
| Constants                      | UPPER_SNAKE_CASE |

### Backend

| Type                                 | Convention       |
| ------------------------------------ | ---------------- |
| Folders, Files, Variables, Functions | snake_case       |
| Classes                              | PascalCase       |
| Constants                            | UPPER_SNAKE_CASE |

---

## Misc

### Git

- Begin all commit messages with verb in Present Simple tense.
- Prefix all commit messages with semantic prefix according to conventional commits ([read more](https://www.conventionalcommits.org/en/v1.0.0/)).

Examples:

```
feat: add feature
refac: remove module
docs: update docs
perf: optimize database querying
```

### Frontend

- Use types & TypeScript.
- Keep components small.
- Prefer local state over global.

Examples:

```ts
// Bad
function getSum(x, y) {  // no explicit types for arguments and return types
    return x + y;
}

// Good
function getSum(x: number, y: number): number {
    return x + y;
}

// Bad
function processData(): void {
    const initialData = []; // no explicit type for array
    // ...
}

// Good
function processData(): void {
    const initialData: string[] = [];
    // ...
}
```

### Backend

- Use type hints for arguments, return types and empty non-primitive variables (lists, dictionaries, sets, tuples, etc.). Type hints can be omitted in primitive variables and class instances.
- Do not use hardcoded http codes. Instead use `status` module from `FastAPI` package.

Examples:

```python
# Bad
def get_sum(x, y):  # arguments and return type are unknown
    return x + y


# Good
def get_sum(x: int, y: int) -> int:
    return x + y


# Bad
def process_data() -> None:
    initial_data = {}  # no explicit type hint for empty non-primitive value
    # ...


# Good
def process_data() -> None:
    initial_data: dict[str, int] = {}
    # ...


# Preferrable
count = 0  # type hint can be ommited
user = UserModel()  # no need to add type hint to class instance
status: str | None = None  # type hint is needed because `status` is not string only
```

---

## API

- Use camelCase in API request body and response.
- Always return 4xx or 5xx status code if error occures.
- Always validate input/output data.

---

## Formatting & Linting

- Prettier & ESLint (Svelte) - deprecated, expected migration to Biome.
- Ruff (Python) - use VSCode extension for formatting.

