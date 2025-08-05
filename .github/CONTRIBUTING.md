# Contributing to Daily Task Manager

We welcome contributions to the Daily Task Manager! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: Node.js 20)
- npm or pnpm (preferred)
- Git

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/daily-task-manager-frontend.git`
3. Install dependencies: `pnpm install`
4. Start development server: `pnpm run dev`
5. Open http://localhost:5173 in your browser

## Development Workflow

### Branch Naming Convention
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring
- `test/description` - for adding tests

### Code Standards
- Use TypeScript for all new code
- Follow existing ESLint configuration
- Use functional components with hooks
- Implement proper error boundaries
- Write meaningful commit messages
- Add appropriate TypeScript types

### Quality Checks
Before submitting a PR, ensure:
```bash
pnpm run typecheck  # TypeScript compilation
pnpm run lint       # ESLint checks
pnpm run build      # Production build
```

### Testing
- Write unit tests for new features
- Test components in isolation
- Verify responsive design
- Test accessibility features
- Cross-browser compatibility

## Pull Request Process

1. **Create Feature Branch**: Create a branch from `main`
2. **Make Changes**: Implement your feature/fix
3. **Test Thoroughly**: Run all quality checks
4. **Update Documentation**: Update README if needed
5. **Submit PR**: Create a pull request with detailed description
6. **Code Review**: Address reviewer feedback
7. **Merge**: Maintainer will merge after approval

### PR Requirements
- [ ] All CI checks pass
- [ ] Code follows project standards
- [ ] Adequate test coverage
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)

## Code Style Guidelines

### React/TypeScript
```typescript
// Use functional components with proper typing
interface Props {
  title: string;
  onComplete: (id: string) => void;
}

export const TaskItem: React.FC<Props> = ({ title, onComplete }) => {
  // Component implementation
};
```

### State Management
- Use Redux Toolkit for global state
- Use React hooks for local state
- Implement proper error handling
- Follow immutable update patterns

### Styling
- Use Tailwind CSS for styling
- Follow responsive design principles
- Maintain consistent spacing and typography
- Use semantic HTML elements

## Issue Reporting

### Bug Reports
- Use the bug report template
- Include browser/OS information
- Provide steps to reproduce
- Add screenshots if applicable

### Feature Requests
- Use the feature request template
- Explain the use case clearly
- Consider implementation complexity
- Provide mockups if helpful

## Code of Conduct

### Expected Behavior
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the community

### Unacceptable Behavior
- Harassment or discrimination
- Offensive language or imagery
- Personal attacks
- Spam or self-promotion

## Getting Help

- Check existing issues and documentation
- Ask questions in issue discussions
- Be specific about your problem
- Provide relevant context and code samples

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors graph

Thank you for contributing to Daily Task Manager!