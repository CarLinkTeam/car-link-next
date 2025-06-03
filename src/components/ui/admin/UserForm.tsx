'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface User {
  id: string;
  fullName?: string;
  phone?: string;
  location?: string;
  email?: string;
}

interface UserFormData {
  fullName?: string;
  phone?: string;
  location?: string;
  password?: string;
}

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => void;
  submitting: boolean;
}

export default function UserForm({ user, onSubmit, submitting }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    location: user?.location || '',
    password: '',
  });

  const [initialFormData, setInitialFormData] = useState<UserFormData>({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    location: user?.location || '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      const newForm = {
        fullName: user.fullName || '',
        phone: user.phone || '',
        location: user.location || '',
        password: '',
      };
      setFormData(newForm);
      setInitialFormData(newForm);
    }
  }, [user]);

  const isFormChanged = (): boolean => {
    return Object.keys(formData).some((key) => {
      const typedKey = key as keyof UserFormData;
      return formData[typedKey] !== initialFormData[typedKey];
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.phone && formData.phone.trim() !== '') {
      const phoneRegex = /^\+\d{1,3}\d{6,14}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'El número de teléfono debe empezar con + seguido del código de país y el número sin espacios';
      }
    }

    if (formData.password && formData.password.trim() !== '') {
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (formData.password.length > 50) {
        newErrors.password = 'La contraseña no puede tener más de 50 caracteres';
      } else {
        const passwordRegex = /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        if (!passwordRegex.test(formData.password)) {
          newErrors.password = 'La contraseña debe tener una mayúscula, una minúscula y un número';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSubmit: UserFormData = {};

    if (formData.fullName && formData.fullName.trim() !== '') {
      dataToSubmit.fullName = formData.fullName.trim();
    }

    if (formData.phone && formData.phone.trim() !== '') {
      dataToSubmit.phone = formData.phone.trim();
    }

    if (formData.location && formData.location.trim() !== '') {
      dataToSubmit.location = formData.location.trim();
    }

    if (formData.password && formData.password.trim() !== '') {
      dataToSubmit.password = formData.password;
    }

    onSubmit(dataToSubmit);
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email (solo lectura) */}
      {user?.email && (
        <Input
          id="email"
          type="email"
          label="Email"
          value={user.email}
          disabled
          className="bg-gray-50"
        />
      )}

      {/* Nombre completo */}
      <Input
        id="fullName"
        type="text"
        label="Nombre completo"
        value={formData.fullName}
        onChange={(e) => handleInputChange('fullName', e.target.value)}
        placeholder="Ej: Juan Pérez"
        disabled={submitting}
        error={errors.fullName}
      />

      {/* Teléfono */}
      <Input
        id="phone"
        type="tel"
        label="Teléfono"
        value={formData.phone}
        onChange={(e) => handleInputChange('phone', e.target.value)}
        placeholder="Ej: +1234567890"
        disabled={submitting}
        error={errors.phone}
        description="Formato: +código_país seguido del número sin espacios"
      />

      {/* Ubicación */}
      <Input
        id="location"
        type="text"
        label="Ubicación"
        value={formData.location}
        onChange={(e) => handleInputChange('location', e.target.value)}
        placeholder="Ej: Nueva York"
        disabled={submitting}
        error={errors.location}
      />

      {/* Contraseña */}
      <Input
        id="password"
        type="password"
        label="Nueva contraseña"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        placeholder="Dejar vacío para mantener la actual"
        disabled={submitting}
        error={errors.password}
        description="Debe tener al menos 6 caracteres con mayúscula, minúscula y un número"
        showPasswordToggle={true}
      />

      {/* Botón de envío */}
      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={!isFormChanged() || submitting}
          className="min-w-[120px]"
        >
          {submitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}
