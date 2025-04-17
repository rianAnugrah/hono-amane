// import { usePageContext } from './usePageContext'

// export { Link }

// function Link(props: { href: string; className?: string; children: React.ReactNode }) {
//   const pageContext = usePageContext()
//   const { urlPathname } = pageContext
//   const { href } = props
//   const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(href)
//   const className = [props.className, isActive && 'is-active'].filter(Boolean).join(' ')
//   return <a {...props} className={className} />
// }

// import { usePageContext } from './usePageContext'
// import { navigate } from 'vike/client/router'
// export { Link }

// function Link(props: { href: string; className?: string; children: React.ReactNode }) {
//   const pageContext = usePageContext()
//   const { urlPathname } = pageContext
//   const { href, className, children } = props

//   const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(href)
//   const classNames = [className, isActive && 'is-active'].filter(Boolean).join(' ')

//   const handleClick = (e: React.MouseEvent) => {
//     if (
//       e.ctrlKey ||
//       e.metaKey ||
//       e.shiftKey ||
//       e.altKey ||
//       e.button !== 0 || // Only left-click
//       e.defaultPrevented
//     ) {
//       return
//     }

//     e.preventDefault()
//     navigate(href)
//   }

//   return (
//     <a href={href} className={classNames} onClick={handleClick}>
//       {children}
//     </a>
//   )
// }

import { usePageContext } from "./usePageContext";

export { Link };

function Link(props: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const { href } = props;
  const isActive =
    href === "/" ? urlPathname === href : urlPathname.startsWith(href);
  const className = [props.className, isActive && "is-active"]
    .filter(Boolean)
    .join(" ");
  return <a {...props} className={className} />;
}
