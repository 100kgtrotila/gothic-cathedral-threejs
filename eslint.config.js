import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Тут можна вимикати правила, які тобі заважають.
      // Наприклад, дозволимо використовувати any, якщо це тимчасово необхідно:
      '@typescript-eslint/no-explicit-any': 'warn',
      // Вимикаємо помилку, якщо змінна оголошена, але поки не використовується:
      '@typescript-eslint/no-unused-vars': 'warn'
    },
  }
);          