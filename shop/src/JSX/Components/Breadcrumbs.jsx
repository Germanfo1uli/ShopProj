// import React from 'react';
// import NextLink from 'next/link';
// import s from '../../CSS/Breadcrumbs.module.css';
//  НЕИЗВЕСТНАЯ ОШИБКА ПОКА КАК ЗАДУМКА ДЛЯ УДОБНОЙ НАВИГАЦИИ
// const Breadcrumbs = ({ items }) => {
//     return (
//         <div className={s.breadcrumbs}>
//             {items.map((item, index) => (
//                 <React.Fragment key={index}>
//                     {item.path ? (
//                         <NextLink href={item.path} passHref legacyBehavior>
//                             <a className={s.itemLink}>
//                                 {item.label}
//                             </a>
//                         </NextLink>
//                     ) : (
//                         <span className={s.item}>{item.label}</span>
//                     )}
//                     {index < items.length - 1 && <span className={s.separator}>/</span>}
//                 </React.Fragment>
//             ))}
//         </div>
//     );
// };
//
// export default Breadcrumbs;