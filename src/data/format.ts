export function dataToMarkdownTable<T extends Record<keyof T, string | number | Date | null | undefined>>(
    data: T[] | T,
    rowLabels?: string[]
): string {
    if (Array.isArray(data)) {
        if (data.length === 0) {
            return '';
        }

        const keys = Object.keys(data[0]) as (keyof T)[];
        const titles = (rowLabels && rowLabels.length === keys.length)? rowLabels : keys;
        const headerRow = '|' + titles.map(key => ` ${String(key)} `).join('|') + '|\n';
        const separatorRow = '|' + keys.map(() => ' --- ').join('|') + '|\n';
        const dataRows = data.map(item => constructMarkdownTableRow(item)).join('');
        return headerRow + separatorRow + dataRows;
    } else {
        if (Object.keys(data).length === 0) {
            return '';
        }

        const headers = rowLabels && rowLabels.length === 2 ? rowLabels : ['Category', 'Count'];
        const headerRow = `| ${headers[0]} | ${headers[1]} |\n|----------|-------|\n`;
        const dataRows = Object.entries(data).map(([category, count]) =>
          constructMarkdownTableRow({
            category,
            count: count as string | number | Date | null | undefined,
          })
        )
        .join('');
        return headerRow + dataRows;
    }
}

function constructMarkdownTableRow(data: Record<string, string | number | Date | null | undefined>): string {
    return '|' + Object.values(data)
        .map(value => formatTableValue(value)) 
        .join('|') + '|\n';
}

function formatTableValue(value: string | number | Date | null | undefined): string {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return value.toISOString().split('T')[0]; // Format Date as YYYY-MM-DD
    return value.toString(); 
}
