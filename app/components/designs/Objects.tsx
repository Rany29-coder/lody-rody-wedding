import { artPath, type DesignSlug } from "./catalog";
export function BotanicalPaper({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`botanical-paper ${className}`}
      style={{ backgroundImage: `url("${artPath}")` }}
    />
  );
}
export function Initials() {
  return (
    <span className="initials">
      <span>R</span>
      <i>&</i>
      <span>L</span>
    </span>
  );
}
export function Seal() {
  return (
    <span className="wax-seal">
      <span>
        R<span>&</span>L
      </span>
    </span>
  );
}
export function LeafBranch({ className = "" }: { className?: string }) {
  return (
    <span
      className={`leaf-branch ${className}`}
      aria-hidden="true"
      style={{
        backgroundImage: `url("${artPath.replace("botanical-paper.webp", "eucalyptus.webp")}")`,
      }}
    />
  );
}
export function InvitationFace({ small = false }: { small?: boolean }) {
  return (
    <div className={`invitation-face ${small ? "small-face" : ""}`}>
      <BotanicalPaper />
      <div className="face-copy">
        <span className="micro">Together with their families</span>
        <Initials />
        <span className="face-names">Rody & Lody</span>
        <span className="micro">Joyfully invite you to celebrate</span>
        <span className="face-date">
          07 <i>/</i> 11 <i>/</i> 26
        </span>
        <span className="micro">Qasr El Dobara · Cairo</span>
      </div>
    </div>
  );
}
export default function DesignObject({
  slug,
  opened = false,
  page = 0,
}: {
  slug: DesignSlug;
  opened?: boolean;
  page?: number;
}) {
  return (
    <div
      className={`object ${slug} ${opened ? "is-open" : ""}`}
      aria-hidden="true"
    >
      {slug === "the-letter" && (
        <>
          <div className="envelope-body" />
          <div className="letter-insert">
            <InvitationFace small />
          </div>
          <div className="envelope-pocket">
            <span className="envelope-folds" />
          </div>
          <div className="envelope-flap">
            <BotanicalPaper />
          </div>
          <div className="envelope-seal">
            <Seal />
          </div>
        </>
      )}
      {slug === "the-fold" && (
        <>
          <div className="gate-card">
            <InvitationFace />
          </div>
          <div className="gate left-gate">
            <BotanicalPaper />
            <span>R</span>
          </div>
          <div className="gate right-gate">
            <BotanicalPaper />
            <span>L</span>
          </div>
          <div className="gate-tie">
            <Seal />
          </div>
        </>
      )}
      {slug === "the-keepsake" && (
        <>
          <div className="box-base">
            <div className="box-inner">
              <InvitationFace small />
            </div>
          </div>
          <div className="box-lid">
            <span className="ribbon ribbon-horizontal" />
            <span className="ribbon ribbon-vertical" />
            <div className="lid-label">
              <span className="micro">You are invited</span>
              <Initials />
              <span className="micro">07 · 11 · 2026</span>
            </div>
          </div>
        </>
      )}
      {slug === "the-storybook" && (
        <>
          <div className="book-pages">
            <BotanicalPaper />
            <div className={`book-page-copy page-${page}`} key={page}>
              {page === 0 ? (
                <>
                  <span className="micro">Chapter one</span>
                  <h3>
                    We choose
                    <br />
                    forever.
                  </h3>
                  <p>Rody & Lody</p>
                  <span className="micro">November 7, 2026</span>
                </>
              ) : (
                <>
                  <span className="micro">Chapter two</span>
                  <h3>
                    Meet us
                    <br />
                    in Cairo.
                  </h3>
                  <p>
                    Qasr El Dobara
                    <br />
                    Evangelical Church
                  </p>
                  <span className="micro">Time to be confirmed</span>
                </>
              )}
            </div>
          </div>
          <div className="book-cover">
            <div className="book-spine" />
            <span className="micro">The wedding of</span>
            <Initials />
            <span className="book-title">Rody & Lody</span>
            <span className="micro">Our next chapter</span>
            <span className="book-flower">✳</span>
          </div>
        </>
      )}
      {slug === "the-garden" && (
        <>
          <div className="garden-arch back-arch" />
          <div className="garden-arch middle-arch" />
          <div className="garden-invitation">
            <InvitationFace small />
          </div>
          <div className="garden-arch front-arch" />
          <LeafBranch className="garden-leaves-left" />
          <LeafBranch className="garden-leaves-right" />
        </>
      )}
    </div>
  );
}
