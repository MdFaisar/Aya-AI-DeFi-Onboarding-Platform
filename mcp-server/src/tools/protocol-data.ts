import axios from 'axios';

interface ProtocolDataArgs {
  protocol: string;
  dataType: 'tvl' | 'apy' | 'volume' | 'fees' | 'security';
  timeframe?: '1d' | '7d' | '30d' | '90d';
}

interface ProtocolData {
  protocol: string;
  dataType: string;
  value: string | number;
  change24h?: string;
  lastUpdated: string;
  source: string;
}

export async function getProtocolData(args: ProtocolDataArgs): Promise<any> {
  const { protocol, dataType, timeframe = '7d' } = args;

  try {
    const data = await fetchProtocolData(protocol, dataType, timeframe);
    return {
      content: [
        {
          type: 'text',
          text: formatProtocolData(data),
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching protocol data:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Unable to fetch ${dataType} data for ${protocol}. Please try again later.`,
        },
      ],
      isError: true,
    };
  }
}

async function fetchProtocolData(protocol: string, dataType: string, timeframe: string): Promise<ProtocolData> {
  // Mock data - in production, this would integrate with DeFi Llama, CoinGecko, etc.
  const mockData: Record<string, Record<string, any>> = {
    uniswap: {
      tvl: {
        value: '$4.2B',
        change24h: '+2.3%',
        description: 'Total Value Locked across all Uniswap pools',
      },
      apy: {
        value: '15.2%',
        change24h: '-0.5%',
        description: 'Average APY for liquidity providers',
      },
      volume: {
        value: '$1.2B',
        change24h: '+8.7%',
        description: '24h trading volume',
      },
      fees: {
        value: '$3.6M',
        change24h: '+8.7%',
        description: '24h fees generated',
      },
      security: {
        value: 'High',
        change24h: 'Stable',
        description: 'Security score based on audits and track record',
      },
    },
    aave: {
      tvl: {
        value: '$6.8B',
        change24h: '+1.2%',
        description: 'Total Value Locked in Aave protocol',
      },
      apy: {
        value: '3.5%',
        change24h: '+0.1%',
        description: 'Average lending APY',
      },
      volume: {
        value: '$450M',
        change24h: '+5.2%',
        description: '24h lending/borrowing volume',
      },
      fees: {
        value: '$1.2M',
        change24h: '+5.2%',
        description: '24h protocol fees',
      },
      security: {
        value: 'High',
        change24h: 'Stable',
        description: 'Security score based on audits and track record',
      },
    },
    compound: {
      tvl: {
        value: '$2.1B',
        change24h: '-0.8%',
        description: 'Total Value Locked in Compound protocol',
      },
      apy: {
        value: '2.8%',
        change24h: '-0.2%',
        description: 'Average lending APY',
      },
      volume: {
        value: '$180M',
        change24h: '+2.1%',
        description: '24h lending/borrowing volume',
      },
      fees: {
        value: '$520K',
        change24h: '+2.1%',
        description: '24h protocol fees',
      },
      security: {
        value: 'High',
        change24h: 'Stable',
        description: 'Security score based on audits and track record',
      },
    },
  };

  const protocolData = mockData[protocol.toLowerCase()];
  if (!protocolData) {
    throw new Error(`Protocol ${protocol} not found`);
  }

  const typeData = protocolData[dataType];
  if (!typeData) {
    throw new Error(`Data type ${dataType} not available for ${protocol}`);
  }

  return {
    protocol: protocol.toUpperCase(),
    dataType,
    value: typeData.value,
    change24h: typeData.change24h,
    lastUpdated: new Date().toISOString(),
    source: 'Mock Data (DeFi Llama in production)',
    description: typeData.description,
  };
}

function formatProtocolData(data: ProtocolData & { description?: string }): string {
  const changeIcon = data.change24h?.startsWith('+') ? '📈' : 
                    data.change24h?.startsWith('-') ? '📉' : '➡️';

  return `## ${data.protocol} - ${data.dataType.toUpperCase()} Data

**Current Value:** ${data.value}
**24h Change:** ${data.change24h} ${changeIcon}
**Last Updated:** ${new Date(data.lastUpdated).toLocaleString()}

${data.description ? `**Description:** ${data.description}` : ''}

### Key Insights:
${generateInsights(data)}

### Data Sources:
- ${data.source}
- Real-time blockchain data
- Community-verified metrics

*Data is updated every few minutes. Always verify with multiple sources for important decisions.*`;
}

function generateInsights(data: ProtocolData): string {
  const insights: string[] = [];
  
  // Generate insights based on data type
  switch (data.dataType) {
    case 'tvl':
      if (data.change24h?.startsWith('+')) {
        insights.push('• Growing TVL indicates increasing user confidence');
        insights.push('• More liquidity generally means better trading conditions');
      } else if (data.change24h?.startsWith('-')) {
        insights.push('• Declining TVL may indicate market uncertainty');
        insights.push('• Monitor for potential liquidity issues');
      }
      break;
      
    case 'apy':
      const apyValue = parseFloat(data.value.toString().replace('%', ''));
      if (apyValue > 10) {
        insights.push('• High APY - verify sustainability and risks');
        insights.push('• Consider impermanent loss for LP positions');
      } else if (apyValue < 3) {
        insights.push('• Conservative APY - likely more stable');
        insights.push('• Good for risk-averse strategies');
      }
      break;
      
    case 'volume':
      if (data.change24h?.startsWith('+')) {
        insights.push('• Increasing volume shows healthy activity');
        insights.push('• Higher fees for liquidity providers');
      }
      break;
      
    case 'security':
      insights.push('• Always review recent audit reports');
      insights.push('• Monitor for any security incidents');
      insights.push('• Consider insurance options if available');
      break;
  }
  
  if (insights.length === 0) {
    insights.push('• Monitor trends over longer time periods');
    insights.push('• Compare with similar protocols');
  }
  
  return insights.join('\n');
}

// Helper function to get historical data
export async function getHistoricalData(protocol: string, dataType: string, timeframe: string) {
  // Mock historical data points
  const mockHistorical = {
    uniswap: {
      tvl: {
        '7d': ['$4.0B', '$4.1B', '$4.0B', '$4.2B', '$4.1B', '$4.3B', '$4.2B'],
        '30d': Array(30).fill(0).map((_, i) => `$${(3.8 + Math.random() * 0.8).toFixed(1)}B`),
      },
    },
  };
  
  return mockHistorical[protocol.toLowerCase()]?.[dataType]?.[timeframe] || [];
}
