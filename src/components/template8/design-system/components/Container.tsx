import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Container component props
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'fluid';
  centered?: boolean;
  paddingX?: boolean;
  paddingY?: boolean;
}

/**
 * Enhanced Container component with design system integration
 * 
 * This component provides consistent container widths and padding
 * for layout sections throughout the application.
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    className, 
    size = 'lg', 
    centered = true,
    paddingX = true,
    paddingY = false,
    children, 
    ...props 
  }, ref) => {
    // Size mapping
    const sizeMap = {
      sm: 'max-w-screen-sm', // 640px
      md: 'max-w-screen-md', // 768px
      lg: 'max-w-screen-lg', // 1024px
      xl: 'max-w-screen-xl', // 1280px
      full: 'max-w-full',    // 100%
      fluid: 'max-w-[1920px]', // Fluid but with a max
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          sizeMap[size],
          centered && 'mx-auto',
          paddingX && 'px-4 sm:px-6 lg:px-8',
          paddingY && 'py-4 sm:py-6 lg:py-8',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

/**
 * Section component props
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  fullWidth?: boolean;
  fullHeight?: boolean;
  paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'fluid';
  withContainer?: boolean;
  id?: string;
}

/**
 * Enhanced Section component with design system integration
 * 
 * This component provides consistent section spacing and container
 * wrapping for page sections.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    fullWidth = false,
    fullHeight = false,
    paddingTop = 'lg',
    paddingBottom = 'lg',
    containerSize = 'lg',
    withContainer = true,
    children,
    id,
    ...props 
  }, ref) => {
    // Padding top mapping
    const paddingTopMap = {
      none: 'pt-0',
      sm: 'pt-4 sm:pt-6',
      md: 'pt-6 sm:pt-8 lg:pt-12',
      lg: 'pt-8 sm:pt-12 lg:pt-16',
      xl: 'pt-12 sm:pt-16 lg:pt-24',
    };
    
    // Padding bottom mapping
    const paddingBottomMap = {
      none: 'pb-0',
      sm: 'pb-4 sm:pb-6',
      md: 'pb-6 sm:pb-8 lg:pb-12',
      lg: 'pb-8 sm:pb-12 lg:pb-16',
      xl: 'pb-12 sm:pb-16 lg:pb-24',
    };
    
    const content = withContainer ? (
      <Container size={containerSize} paddingX={!fullWidth}>
        {children}
      </Container>
    ) : children;
    
    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          paddingTopMap[paddingTop],
          paddingBottomMap[paddingBottom],
          fullHeight && 'min-h-screen',
          className
        )}
        {...props}
      >
        {content}
      </section>
    );
  }
);

Section.displayName = 'Section';

/**
 * Grid component props
 */
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  colsMd?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  colsXl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
}

/**
 * Enhanced Grid component with design system integration
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    className, 
    cols = 1, 
    gap = 'md',
    colsMd,
    colsLg,
    colsXl,
    children, 
    ...props 
  }, ref) => {
    // Columns mapping
    const colsMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    };
    
    // Responsive columns mapping
    const colsMdMap = {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      5: 'md:grid-cols-5',
      6: 'md:grid-cols-6',
      12: 'md:grid-cols-12',
    };
    
    const colsLgMap = {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6',
      12: 'lg:grid-cols-12',
    };
    
    const colsXlMap = {
      1: 'xl:grid-cols-1',
      2: 'xl:grid-cols-2',
      3: 'xl:grid-cols-3',
      4: 'xl:grid-cols-4',
      5: 'xl:grid-cols-5',
      6: 'xl:grid-cols-6',
      12: 'xl:grid-cols-12',
    };
    
    // Gap mapping
    const gapMap = {
      none: 'gap-0',
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colsMap[cols],
          colsMd && colsMdMap[colsMd],
          colsLg && colsLgMap[colsLg],
          colsXl && colsXlMap[colsXl],
          gapMap[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

/**
 * Flex component props
 */
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Enhanced Flex component with design system integration
 */
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    className, 
    direction = 'row', 
    align = 'start',
    justify = 'start',
    wrap = 'nowrap',
    gap = 'none',
    children, 
    ...props 
  }, ref) => {
    // Direction mapping
    const directionMap = {
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
      col: 'flex-col',
      'col-reverse': 'flex-col-reverse',
    };
    
    // Align mapping
    const alignMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };
    
    // Justify mapping
    const justifyMap = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };
    
    // Wrap mapping
    const wrapMap = {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
    };
    
    // Gap mapping
    const gapMap = {
      none: 'gap-0',
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directionMap[direction],
          alignMap[align],
          justifyMap[justify],
          wrapMap[wrap],
          gapMap[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';