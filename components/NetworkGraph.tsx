import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Svg, { Circle, Line, G, Text as SvgText, Rect } from 'react-native-svg';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows, getSafetyColor } from '../constants/theme';
import { SensorNode } from '../services/mockData';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NetworkGraphProps {
  nodes: SensorNode[];
  width?: number;
  height?: number;
  onNodePress?: (node: SensorNode) => void;
}

const NODE_RADIUS = 22;
const GRAPH_PADDING = 40;

export default function NetworkGraph({ nodes, width: propWidth, height: propHeight, onNodePress }: NetworkGraphProps) {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<SensorNode | null>(null);
  
  const screenWidth = Dimensions.get('window').width;
  const width = propWidth || screenWidth - Spacing.xl * 2;
  const height = propHeight || 500;

  if (nodes.length === 0) return null;

  // Scale positions to fit the SVG viewport
  const maxX = Math.max(...nodes.map(n => n.position.x)) + GRAPH_PADDING;
  const maxY = Math.max(...nodes.map(n => n.position.y)) + GRAPH_PADDING;
  const scaleX = (width - GRAPH_PADDING * 2) / maxX;
  const scaleY = (height - GRAPH_PADDING * 2) / maxY;
  const scale = Math.min(scaleX, scaleY, 1.5);

  const getPos = (pos: { x: number; y: number }) => ({
    x: pos.x * scale + GRAPH_PADDING,
    y: pos.y * scale + GRAPH_PADDING,
  });

  // Collect all edges
  const edges: { from: SensorNode; to: SensorNode }[] = [];
  const edgeSet = new Set<string>();
  nodes.forEach(node => {
    node.connections.forEach(connId => {
      const connNode = nodes.find(n => n.id === connId);
      if (connNode) {
        const edgeKey = [Math.min(node.id, connNode.id), Math.max(node.id, connNode.id)].join('-');
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({ from: node, to: connNode });
        }
      }
    });
  });

  const handleNodePress = (node: SensorNode) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
    onNodePress?.(node);
  };

  return (
    <View style={styles.container}>
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>{t('map.legend')}</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.safe }]} />
            <Text style={styles.legendText}>{t('map.safe')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.legendText}>{t('map.warning')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
            <Text style={styles.legendText}>{t('map.danger')}</Text>
          </View>
        </View>
      </View>

      {/* SVG Graph */}
      <View style={styles.graphContainer}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background grid pattern */}
          {Array.from({ length: Math.ceil(width / 30) }, (_, i) => (
            <Line
              key={`gv-${i}`}
              x1={i * 30} y1={0} x2={i * 30} y2={height}
              stroke={Colors.borderLight} strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: Math.ceil(height / 30) }, (_, i) => (
            <Line
              key={`gh-${i}`}
              x1={0} y1={i * 30} x2={width} y2={i * 30}
              stroke={Colors.borderLight} strokeWidth={0.5}
            />
          ))}

          {/* Edges (pipes) */}
          {edges.map((edge, i) => {
            const fromPos = getPos(edge.from.position);
            const toPos = getPos(edge.to.position);
            const worstStatus = edge.from.status === 'danger' || edge.to.status === 'danger'
              ? 'danger'
              : edge.from.status === 'warning' || edge.to.status === 'warning'
                ? 'warning' : 'safe';
            const pipeColor = getSafetyColor(worstStatus).color;
            
            return (
              <G key={`edge-${i}`}>
                {/* Pipe outer */}
                <Line
                  x1={fromPos.x} y1={fromPos.y}
                  x2={toPos.x} y2={toPos.y}
                  stroke={`${pipeColor}40`}
                  strokeWidth={8}
                  strokeLinecap="round"
                />
                {/* Pipe inner */}
                <Line
                  x1={fromPos.x} y1={fromPos.y}
                  x2={toPos.x} y2={toPos.y}
                  stroke={`${pipeColor}80`}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </G>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = getPos(node.position);
            const color = getSafetyColor(node.status);
            const isSelected = selectedNode?.id === node.id;

            return (
              <G key={`node-${node.id}`} onPress={() => handleNodePress(node)}>
                {/* Pulse ring for danger */}
                {node.status === 'danger' && (
                  <Circle
                    cx={pos.x} cy={pos.y}
                    r={NODE_RADIUS + 8}
                    fill="none"
                    stroke={`${Colors.danger}40`}
                    strokeWidth={3}
                  />
                )}
                
                {/* Selection ring */}
                {isSelected && (
                  <Circle
                    cx={pos.x} cy={pos.y}
                    r={NODE_RADIUS + 5}
                    fill="none"
                    stroke={Colors.accent}
                    strokeWidth={2.5}
                    strokeDasharray="5,3"
                  />
                )}

                {/* Node outer circle */}
                <Circle
                  cx={pos.x} cy={pos.y}
                  r={NODE_RADIUS}
                  fill={color.bg as string}
                  stroke={color.color as string}
                  strokeWidth={2.5}
                />

                {/* Node inner circle */}
                <Circle
                  cx={pos.x} cy={pos.y}
                  r={NODE_RADIUS - 6}
                  fill={color.color as string}
                  opacity={0.15}
                />

                {/* Node label */}
                <SvgText
                  x={pos.x} y={pos.y + 1}
                  textAnchor="middle"
                  alignmentBaseline="central"
                  fontSize={12}
                  fontWeight="700"
                  fill={color.color as string}
                >
                  {node.id}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {/* Selected Node Detail */}
      {selectedNode && (
        <View style={[styles.nodeDetail, { borderLeftColor: getSafetyColor(selectedNode.status).color as string }]}>
          <View style={styles.nodeDetailHeader}>
            <Text style={styles.nodeDetailTitle}>
              {t('nodes.nodeId', { id: selectedNode.id })}
            </Text>
            <Pressable onPress={() => setSelectedNode(null)}>
              <MaterialCommunityIcons name="close-circle" size={22} color={Colors.textTertiary} />
            </Pressable>
          </View>
          <View style={styles.nodeDetailGrid}>
            <View style={styles.nodeDetailItem}>
              <Text style={styles.nodeDetailLabel}>O₂</Text>
              <Text style={styles.nodeDetailValue}>{selectedNode.oxygen}%</Text>
            </View>
            <View style={styles.nodeDetailItem}>
              <Text style={styles.nodeDetailLabel}>{t('nodes.toxicGas')}</Text>
              <Text style={styles.nodeDetailValue}>{selectedNode.toxicGas} ppm</Text>
            </View>
            <View style={styles.nodeDetailItem}>
              <Text style={styles.nodeDetailLabel}>{t('nodes.temperature')}</Text>
              <Text style={styles.nodeDetailValue}>{selectedNode.temperature}°C</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  legendTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  legendItems: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  graphContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  nodeDetail: {
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    ...Shadows.md,
  },
  nodeDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  nodeDetailTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  nodeDetailGrid: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  nodeDetailItem: {
    flex: 1,
  },
  nodeDetailLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  nodeDetailValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
});
