import React from 'react';

interface SplitContainer {
  title: string;
  children: any;
  hide?: boolean;
}

export default (props: SplitContainer) => {
  const { children, title , hide=false } = props;

  return (
    <div
      style={{
        borderBottom: hide ? '' : 'solid 1px #E3E4E6',
        paddingTop: '15px',
        paddingBottom: '15px'
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '22px',
          marginBottom: '15px'
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
};
