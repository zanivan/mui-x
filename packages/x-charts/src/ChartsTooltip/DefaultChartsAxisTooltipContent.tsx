import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipTable,
  ChartsTooltipMark,
  ChartsTooltipRow,
} from './ChartsTooltipTable';
import type { ChartsAxisContentProps } from './ChartsAxisTooltipContent';

function DefaultChartsAxisTooltipContent(props: ChartsAxisContentProps) {
  const { series, axis, dataIndex, axisValue, sx, classes } = props;

  if (dataIndex == null) {
    return null;
  }
  const axisFormatter = axis.valueFormatter ?? ((v) => v.toLocaleString());
  return (
    <ChartsTooltipPaper sx={sx} className={classes.root}>
      <ChartsTooltipTable className={classes.table}>
        {axisValue != null && !axis.hideTooltip && (
          <thead>
            <ChartsTooltipRow>
              <ChartsTooltipCell colSpan={3}>
                <Typography>{axisFormatter(axisValue)}</Typography>
              </ChartsTooltipCell>
            </ChartsTooltipRow>
          </thead>
        )}

        <tbody>
          {series.map(({ color, id, label, valueFormatter, data }: ChartSeriesDefaultized<any>) => {
            const formattedValue = valueFormatter(data[dataIndex]);
            if (formattedValue == null) {
              return null;
            }
            return (
              <ChartsTooltipRow key={id} className={classes.row}>
                <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
                  <ChartsTooltipMark
                    ownerState={{ color }}
                    boxShadow={1}
                    className={classes.mark}
                  />
                </ChartsTooltipCell>

                <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)}>
                  {label ? <Typography>{label}</Typography> : null}
                </ChartsTooltipCell>

                <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)}>
                  <Typography>{formattedValue}</Typography>
                </ChartsTooltipCell>
              </ChartsTooltipRow>
            );
          })}
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

DefaultChartsAxisTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The properties of the triggered axis.
   */
  axis: PropTypes.object.isRequired,
  /**
   * Data identifying the triggered axis.
   */
  axisData: PropTypes.shape({
    x: PropTypes.shape({
      index: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
        .isRequired,
    }),
    y: PropTypes.shape({
      index: PropTypes.number,
      value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
        .isRequired,
    }),
  }).isRequired,
  /**
   * The value associated to the current mouse position.
   */
  axisValue: PropTypes.any.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * The index of the data item triggered.
   */
  dataIndex: PropTypes.number,
  /**
   * The series linked to the triggered axis.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { DefaultChartsAxisTooltipContent };
