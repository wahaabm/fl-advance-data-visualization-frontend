import PaperformEmbed from '../components/PaperformEmbed';

export default function Home() {
  return (
    <div>
      <PaperformEmbed
        formSlug="macrobourse"
        showSpinner={true}
      />
    </div>
  );
}
