import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Select } from './Select';

describe('Select component', () => {
  it('renderiza todas as opções', () => {
    const options = [
      { value: 'a', label: 'Opção A' },
      { value: 'b', label: 'Opção B' },
    ];
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3); // inclui placeholder
  });

  it('exibe erro quando passado', () => {
    render(<Select options={[]} error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });
});
