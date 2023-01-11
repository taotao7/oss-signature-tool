import React, { ReactElement } from 'react';

interface SplitContainer {
  title: string;
  children: any;
  hide?: boolean;
  content?: string | ReactElement | undefined;
}

export default (props: SplitContainer) => {
  const { children, title, hide = false, content } = props;

  return (
    <div
      style={{
        borderBottom: hide ? '' : 'solid 1px #E3E4E6',
        marginBottom: '24px',
        paddingBottom: '12px',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '22px',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontWeight: 400,
          fontSize: '12px',
          color: '#808080',
          textAlign: 'left',
          lineHeight: '20px',
          marginTop: '4px',
          marginBottom: '16px',
        }}
      >
        {content}
      </div>
      {children}
    </div>
  );
};
