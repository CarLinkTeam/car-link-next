// __tests__/EntityDetailPage.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useRouter, useParams } from 'next/navigation';
import EntityDetailPage from '../entityDetailPage';

// Mock hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Dummy entity
type DummyEntity = { name: string, description: string };

// Dummy props
const mockEntity: DummyEntity = {
  name: 'Test Entity',
  description: 'Test Description',
};

const renderDetails = (item: DummyEntity) => (
  <div>
    <h2>{item.name}</h2>
    <p>{item.description}</p>
  </div>
);

const getOneMock = jest.fn();
const onDeleteMock = jest.fn();
const pushMock = jest.fn();
const backMock = jest.fn();
const getEditPath = (id: string) => `/edit/${id}`;

// Setup before each test
beforeEach(() => {
  jest.clearAllMocks();
  (useParams as jest.Mock).mockReturnValue({ id: '123' });
  (useRouter as jest.Mock).mockReturnValue({ push: pushMock, back: backMock });
});

describe('EntityDetailPage', () => {
  it('renders loading state initially', async () => {
    getOneMock.mockResolvedValueOnce(mockEntity);

    render(
      <EntityDetailPage
        title="Entidad"
        getOne={getOneMock}
        renderDetails={renderDetails}
        onDelete={onDeleteMock}
        getEditPath={getEditPath}
      />
    );

    expect(screen.getByText(/regresar al listado/i)).toBeInTheDocument();
  });

  it('renders error message if entity not found', async () => {
    getOneMock.mockResolvedValueOnce(null);

    render(
      <EntityDetailPage
        title="Entidad"
        getOne={getOneMock}
        renderDetails={renderDetails}
        onDelete={onDeleteMock}
        getEditPath={getEditPath}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/no se encontró el entidad/i)).toBeInTheDocument();
    });
  });

  it('renders entity details when loaded', async () => {
    getOneMock.mockResolvedValueOnce(mockEntity);

    render(
      <EntityDetailPage
        title="Entidad"
        getOne={getOneMock}
        renderDetails={renderDetails}
        onDelete={onDeleteMock}
        getEditPath={getEditPath}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Entity/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
    });
  });

  it('calls router.push on edit', async () => {
    getOneMock.mockResolvedValueOnce(mockEntity);

    render(
      <EntityDetailPage
        title="Entidad"
        getOne={getOneMock}
        renderDetails={renderDetails}
        onDelete={onDeleteMock}
        getEditPath={getEditPath}
      />
    );

    await waitFor(() => screen.getByText(/Editar/i));
    fireEvent.click(screen.getByText(/Editar/i));

    expect(pushMock).toHaveBeenCalledWith('/edit/123');
  });

});
