/* eslint-disable @next/next/no-img-element */
export default function LogoSVG({ footer = false }: { footer?: boolean }) {
  return (
    <img
      src="/images/logo-nobg.png"
      alt="TT Elec"
      className={footer ? 'logo-img-footer' : 'logo-img-nav'}
    />
  )
}
