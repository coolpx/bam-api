// Central module for BAM stats

export const BAM_STATS = [
    'playtime',
    'placedBricks',
    'rareBricks',
    'layersComplete',
    'money'
];

export function isValidBamStat(stat: string): boolean {
    return BAM_STATS.includes(stat);
}
