import type { ReactNode } from 'react';

type PageHeaderProps = {
  kicker: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleRowClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
  className,
  titleRowClassName,
  descriptionClassName,
  actionsClassName
}: PageHeaderProps) {
  return (
    <div className={joinClassNames('page-topbar', className)}>
      <div className="page-title-block">
        <div className="page-kicker">{kicker}</div>
        <div className={joinClassNames('page-title-row', titleRowClassName)}>
          <h2>{title}</h2>
        </div>
        {description ? (
          <div className={joinClassNames('page-description', descriptionClassName)}>
            {description}
          </div>
        ) : null}
      </div>

      {actions ? (
        <div className={joinClassNames('page-actions', actionsClassName)}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
