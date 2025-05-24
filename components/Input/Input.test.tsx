import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input component', () => {
  it('mostra label quando passado', () => {
    render(<Input label="Teste Label" placeholder="x" />);
    expect(screen.getByText('Teste Label')).toBeInTheDocument();
  });

  it('mostra mensagem de erro em vermelho', () => {
    render(<Input error="Erro aqui" placeholder="x" />);
    const errorElem = screen.getByText('Erro aqui');
    expect(errorElem).toBeInTheDocument();
    expect(errorElem).toHaveClass('text-red-600');
  });
});
