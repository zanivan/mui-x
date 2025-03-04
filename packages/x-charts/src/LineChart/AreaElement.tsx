import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps } from '@mui/base/utils';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import {
  getIsFaded,
  getIsHighlighted,
  useInteractionItemProps,
} from '../hooks/useInteractionItemProps';
import { InteractionContext } from '../context/InteractionProvider';
import { HighlightScope } from '../context/HighlightProvider';
import { AnimatedArea, AnimatedAreaProps } from './AnimatedArea';

export interface AreaElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type AreaElementClassKey = keyof AreaElementClasses;

export interface AreaElementOwnerState {
  id: string;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<AreaElementClasses>;
}

export function getAreaElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiAreaElement', slot);
}

export const areaElementClasses: AreaElementClasses = generateUtilityClasses('MuiAreaElement', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: AreaElementOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getAreaElementUtilityClass, classes);
};

export interface AreaElementSlots {
  /**
   * The component that renders the area.
   * @default AnimatedArea
   */
  area?: React.JSXElementConstructor<AnimatedAreaProps>;
}

export interface AreaElementSlotProps {
  area?: AnimatedAreaProps;
}

export interface AreaElementProps
  extends Omit<AreaElementOwnerState, 'isFaded' | 'isHighlighted'>,
    Pick<AnimatedAreaProps, 'skipAnimation'> {
  d: string;
  highlightScope?: Partial<HighlightScope>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: AreaElementSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: AreaElementSlots;
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/area-element/)
 */
function AreaElement(props: AreaElementProps) {
  const { id, classes: innerClasses, color, highlightScope, slots, slotProps, ...other } = props;
  const getInteractionItemProps = useInteractionItemProps(highlightScope);

  const { item } = React.useContext(InteractionContext);

  const isHighlighted = getIsHighlighted(item, { type: 'line', seriesId: id }, highlightScope);
  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'line', seriesId: id }, highlightScope);

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const Area = slots?.area ?? AnimatedArea;
  const areaProps = useSlotProps({
    elementType: Area,
    externalSlotProps: slotProps?.area,
    additionalProps: {
      ...other,
      ...getInteractionItemProps({ type: 'line', seriesId: id }),
      className: classes.root,
    },
    ownerState,
  });

  return <Area {...areaProps} />;
}

AreaElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  d: PropTypes.string.isRequired,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series']),
  }),
  id: PropTypes.string.isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { AreaElement };
