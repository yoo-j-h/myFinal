import { css } from 'styled-components';

const breakpoints = {
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1400px',
};

export const media = {
  xs: (...args) => css`
    @media (min-width: ${breakpoints.xs}) {
      ${css(...args)}
    }
  `,
  sm: (...args) => css`
    @media (min-width: ${breakpoints.sm}) {
      ${css(...args)}
    }
  `,
  md: (...args) => css`
    @media (min-width: ${breakpoints.md}) {
      ${css(...args)}
    }
  `,
  lg: (...args) => css`
    @media (min-width: ${breakpoints.lg}) {
      ${css(...args)}
    }
  `,
  xl: (...args) => css`
    @media (min-width: ${breakpoints.xl}) {
      ${css(...args)}
    }
  `,
  '2xl': (...args) => css`
    @media (min-width: ${breakpoints['2xl']}) {
      ${css(...args)}
    }
  `,
}; 