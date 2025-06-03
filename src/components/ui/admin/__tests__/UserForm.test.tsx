import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserForm from '../UserForm';
import { AuthService } from '@/lib/api/services/auth-service';
import '@testing-library/jest-dom';
import { UserRole } from '@/lib/types';
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));


jest.mock('@/lib/api/services/auth-service', () => ({
  AuthService: {
    promoteToAdmin: jest.fn(),
  },
}));

const mockOnSubmit = jest.fn();

const user = {
  id: '123',
  fullName: 'Juan Pérez',
  phone: '+1234567890',
  location: 'Madrid',
  email: 'juan@example.com',
  roles: ['USER'] as unknown as UserRole[],
};

describe('UserForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente los campos del formulario', () => {
    render(<UserForm user={user} onSubmit={mockOnSubmit} submitting={false} />);

    expect(screen.getByLabelText(/Nombre completo/i)).toHaveValue('Juan Pérez');
    expect(screen.getByLabelText(/Teléfono/i)).toHaveValue('+1234567890');
    expect(screen.getByLabelText(/Ubicación/i)).toHaveValue('Madrid');
    expect(screen.getByLabelText(/Email/i)).toBeDisabled();
  });

  it('valida número de teléfono incorrecto', async () => {
    render(<UserForm user={user} onSubmit={mockOnSubmit} submitting={false} />);

    fireEvent.change(screen.getByLabelText(/Teléfono/i), {
      target: { value: '12345' },
    });

    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    expect(await screen.findByText(/debe empezar con \+/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('envía el formulario si los datos son válidos y cambiados', async () => {
    render(<UserForm user={user} onSubmit={mockOnSubmit} submitting={false} />);

    fireEvent.change(screen.getByLabelText(/Ubicación/i), {
      target: { value: 'Barcelona' },
    });

    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ location: 'Barcelona' })
      );
    });
  });

  it('no envía si el formulario no ha cambiado', () => {
    render(<UserForm user={user} onSubmit={mockOnSubmit} submitting={false} />);

    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeDisabled();
  });

  it('promueve al usuario a admin correctamente', async () => {
    const mockPromote = AuthService.promoteToAdmin as jest.Mock;
    mockPromote.mockResolvedValueOnce(undefined);

    render(<UserForm user={user} onSubmit={mockOnSubmit} submitting={false} />);

    const promoteBtn = screen.getByRole('button', { name: /promover a admin/i });
    fireEvent.click(promoteBtn);

    await waitFor(() => {
      expect(mockPromote).toHaveBeenCalledWith('123');
      expect(
        screen.getByText(/El usuario ha sido promovido a administrador/i)
      ).toBeInTheDocument();
    });
  });

  it('muestra error si falla la promoción a admin', async () => {
    const mockPromote = AuthService.promoteToAdmin as jest.Mock;
    mockPromote.mockRejectedValueOnce(new Error('Falló'));

    render(<UserForm user={user} onSubmit={mockOnSubmit} submitting={false} />);

    const promoteBtn = screen.getByRole('button', { name: /promover a admin/i });
    fireEvent.click(promoteBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Hubo un problema al promover al usuario/i)
      ).toBeInTheDocument();
    });
  });
});
