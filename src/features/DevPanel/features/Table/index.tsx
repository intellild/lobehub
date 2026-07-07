import { Center, Icon } from '@lobehub/ui';
import { Loader2Icon } from 'lucide-react';
import React from 'react';
import { TableVirtuoso } from 'react-virtuoso';

import styles from './index.module.css';
import TableCell from './TableCell';

interface TableProps {
  columns: string[];
  dataSource: any[];
  loading?: boolean;
}

const Table = ({ columns, dataSource, loading }: TableProps) => {
  if (loading)
    return (
      <Center height={'100%'}>
        <Icon spin icon={Loader2Icon} />
      </Center>
    );

  const header = (
    <tr>
      {columns.map((column) => (
        <th key={column}>{column}</th>
      ))}
    </tr>
  );

  return (
    <div className={styles.table}>
      {dataSource.length === 0 ? (
        <>
          <table>
            <thead>{header}</thead>
          </table>
          <Center height={400}>no rows</Center>
        </>
      ) : (
        <TableVirtuoso
          data={dataSource}
          fixedHeaderContent={() => header}
          itemContent={(index, row) => (
            <>
              {columns.map((column) => (
                <TableCell
                  column={column}
                  dataItem={row}
                  key={`${column}_${index}`}
                  rowIndex={index}
                />
              ))}
            </>
          )}
        />
      )}
    </div>
  );
};

export default Table;
