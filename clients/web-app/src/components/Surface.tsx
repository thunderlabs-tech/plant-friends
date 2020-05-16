import React from 'react';
import { ComponentProps } from '@rmwc/types';
import '@rmwc/elevation/styles';
import { ElevationProps, Elevation } from '@rmwc/elevation';
import { Theme } from '@rmwc/theme';

export type SurfaceProps = Omit<ComponentProps<ElevationProps, React.HTMLProps<HTMLElement>, 'div'>, 'tag' | 'ref'>;

const Surface: React.FC<SurfaceProps> = ({ children, className, ...elevationProps }) => {
  return (
    <Elevation {...elevationProps}>
      <Theme tag="div" use={['surface', 'onSurface']}>
        {children}
      </Theme>
    </Elevation>
  );
};

export default Surface;
