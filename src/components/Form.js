import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

export default function Form({ schema, defaultValues, onSubmit, children, className }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={clsx('form', className)}>
      {typeof children === 'function' ? children({ register, errors, isSubmitting }) : children}
    </form>
  );
}

export function FormField({ label, error, children, required }) {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      {children}
      {error && <span className="form-error">{error.message}</span>}
    </div>
  );
}

export function FormInput({ register, error, ...props }) {
  return (
    <input
      {...register(props.name)}
      {...props}
      className={clsx('form-input', error && 'form-input-error')}
    />
  );
}

export function FormSelect({ register, error, children, ...props }) {
  return (
    <select
      {...register(props.name)}
      {...props}
      className={clsx('form-select', error && 'form-select-error')}
    >
      {children}
    </select>
  );
}

export function FormTextarea({ register, error, ...props }) {
  return (
    <textarea
      {...register(props.name)}
      {...props}
      className={clsx('form-textarea', error && 'form-textarea-error')}
    />
  );
}
