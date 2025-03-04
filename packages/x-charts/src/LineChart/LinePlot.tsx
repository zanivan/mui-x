import * as React from 'react';
import PropTypes from 'prop-types';
import { line as d3Line } from 'd3-shape';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import {
  LineElement,
  LineElementProps,
  LineElementSlotProps,
  LineElementSlots,
} from './LineElement';
import { getValueToPositionMapper } from '../hooks/useScale';
import getCurveFactory from '../internals/getCurve';
import { DEFAULT_X_AXIS_KEY } from '../constants';

export interface LinePlotSlots extends LineElementSlots {}

export interface LinePlotSlotProps extends LineElementSlotProps {}

export interface LinePlotProps
  extends React.SVGAttributes<SVGSVGElement>,
    Pick<LineElementProps, 'slots' | 'slotProps' | 'skipAnimation'> {}

const useAggregatedData = () => {
  const seriesData = React.useContext(SeriesContext).line;
  const axisData = React.useContext(CartesianContext);

  if (seriesData === undefined) {
    return [];
  }

  const { series, stackingGroups } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  return stackingGroups.flatMap(({ ids: groupIds }) => {
    return groupIds.flatMap((seriesId) => {
      const {
        xAxisKey = defaultXAxisId,
        yAxisKey = defaultYAxisId,
        stackedData,
        data,
        connectNulls,
      } = series[seriesId];

      const xScale = getValueToPositionMapper(xAxis[xAxisKey].scale);
      const yScale = yAxis[yAxisKey].scale;
      const xData = xAxis[xAxisKey].data;

      if (process.env.NODE_ENV !== 'production') {
        if (xData === undefined) {
          throw new Error(
            `MUI X Charts: ${
              xAxisKey === DEFAULT_X_AXIS_KEY
                ? 'The first `xAxis`'
                : `The x-axis with id "${xAxisKey}"`
            } should have data property to be able to display a line plot.`,
          );
        }
        if (xData.length < stackedData.length) {
          throw new Error(
            `MUI X Charts: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`,
          );
        }
      }

      const linePath = d3Line<{
        x: any;
        y: [number, number];
      }>()
        .x((d) => xScale(d.x))
        .defined((_, i) => connectNulls || data[i] != null)
        .y((d) => yScale(d.y[1])!);

      const formattedData = xData?.map((x, index) => ({ x, y: stackedData[index] })) ?? [];
      const d3Data = connectNulls ? formattedData.filter((_, i) => data[i] != null) : formattedData;

      const d = linePath.curve(getCurveFactory(series[seriesId].curve))(d3Data) || '';
      return {
        ...series[seriesId],
        d,
        seriesId,
      };
    });
  });
};

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LinePlot API](https://mui.com/x/api/charts/line-plot/)
 */
function LinePlot(props: LinePlotProps) {
  const { slots, slotProps, skipAnimation, ...other } = props;

  const completedData = useAggregatedData();

  return (
    <g {...other}>
      {completedData.map(({ d, seriesId, color, highlightScope }) => {
        return (
          <LineElement
            key={seriesId}
            id={seriesId}
            d={d}
            color={color}
            highlightScope={highlightScope}
            skipAnimation={skipAnimation}
            slots={slots}
            slotProps={slotProps}
          />
        );
      })}
    </g>
  );
}

LinePlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
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

export { LinePlot };
