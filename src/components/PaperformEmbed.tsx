import React from 'react';

export default function PaperformEmbed(props: {
  formSlug: string;
  showSpinner: boolean;
}) {
  const { formSlug, showSpinner = '1' } = props;

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://paperform.co/__embed.min.js';
    document.body.appendChild(script);
  }, []);

  return (
    <div
      data-paperform-id={formSlug}
      data-spinner={showSpinner}
      data-takeover={true}
    />
  );
}
