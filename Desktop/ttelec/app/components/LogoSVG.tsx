/* eslint-disable @next/next/no-img-element */
export default function LogoSVG({ footer = false }: { footer?: boolean }) {
  return (
    <img
      src={footer ? '/images/logo-nobg.png' : '/images/logo-nav.png'}
      alt="TT Elec"
      className={footer ? 'logo-img-footer' : 'logo-img-nav'}
    />
  )
}
