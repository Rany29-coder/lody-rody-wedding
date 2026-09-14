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
      {slug === "the-vellum" && (
        <>
          <div className="vellum-card">
            <InvitationFace />
          </div>
          <div className="vellum-wrap">
            <LeafBranch />
            <span className="micro">For your eyes, with love</span>
            <Initials />
            <Seal />
          </div>
        </>
      )}
      {slug === "the-ribbon" && (
        <>
          <div className="ribbon-card">
            <InvitationFace />
          </div>
          <div className="satin satin-left" />
          <div className="satin satin-right" />
          <div className="ribbon-bow">
            <span />
            <span />
            <Seal />
          </div>
        </>
      )}
      {slug === "the-scroll" && (
        <>
          <div className="scroll-paper">
            <InvitationFace />
          </div>
          <div className="scroll-roller roller-top" />
          <div className="scroll-roller roller-bottom" />
          <div className="scroll-seal">
            <Seal />
          </div>
        </>
      )}
      {slug === "the-fan" && (
        <>
          <div
            className={`fan-card fan-left ${page === 1 ? "fan-active" : ""}`}
          >
            <BotanicalPaper />
            <span className="micro">The day</span>
            <strong>07</strong>
            <span>
              November
              <br />
              2026
            </span>
          </div>
          <div
            className={`fan-card fan-right ${page === 2 ? "fan-active" : ""}`}
          >
            <BotanicalPaper />
            <span className="micro">The place</span>
            <LeafBranch />
            <span>
              Qasr El Dobara
              <br />
              Cairo
            </span>
          </div>
          <div className="fan-card fan-center">
            <InvitationFace />
          </div>
          <span className="fan-pin" />
        </>
      )}
      {slug === "the-frame" && (
        <>
          <div className="frame-base">
            <InvitationFace />
          </div>
          <div className="glass-door">
            <span className="glass-glint" />
            <span className="glass-inscription">Rody & Lody</span>
            <span className="glass-handle" />
          </div>
          <span className="frame-foot foot-left" />
          <span className="frame-foot foot-right" />
        </>
      )}
    </div>
  );
}
