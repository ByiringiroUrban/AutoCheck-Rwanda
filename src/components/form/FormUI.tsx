import type { ComponentProps, ReactNode } from "react";

type FormProps = ComponentProps<"form">;

export function Form({ className = "", children, ...props }: FormProps) {
  return (
    <form {...props} className={`ac-form ${className}`.trim()}>
      {children}
    </form>
  );
}

export function FormSection({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`ac-form-section ${className}`.trim()}>
      {title || description ? (
        <header className="ac-form-section__header">
          {title ? <h2 className="ac-form-section__title">{title}</h2> : null}
          {description ? <p className="ac-form-section__description">{description}</p> : null}
        </header>
      ) : null}
      <div className="ac-form-section__content">{children}</div>
    </section>
  );
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`ac-form-field ${className}`.trim()}>
      <label className="ac-form-field__label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint ? <p className="ac-form-field__hint">{hint}</p> : null}
      {error ? <p className="ac-form-field__error" role="alert">{error}</p> : null}
    </div>
  );
}

export function FormGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ac-form-grid ${className}`.trim()}>{children}</div>;
}

export function FormActions({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ac-form-actions ${className}`.trim()}>{children}</div>;
}
