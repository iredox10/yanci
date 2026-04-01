/**
 * SkipNav — accessibility skip-to-content link.
 *
 * Visible only on focus (keyboard tab), allows keyboard users
 * to jump past navigation directly to the main content.
 */

export default function SkipNav() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
    >
      Tsallaka zuwa ciki
    </a>
  );
}
