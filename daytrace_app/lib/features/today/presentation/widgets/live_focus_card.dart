import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/theme_provider.dart';
import '../../../../core/theme/daytrace_theme.dart';

class LiveFocusCard extends ConsumerStatefulWidget {
  const LiveFocusCard({super.key});

  @override
  ConsumerState<LiveFocusCard> createState() => _LiveFocusCardState();
}

class _LiveFocusCardState extends ConsumerState<LiveFocusCard> with SingleTickerProviderStateMixin {
  late final AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: false);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeTokens = ref.watch(themeProvider.notifier).tokens;

    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          decoration: BoxDecoration(
            color: themeTokens.surface.withValues(alpha: 0.9),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: themeTokens.outlineVariant.withValues(alpha: 0.8)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 24,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Stack(
            children: [
              // Top Gradient Accent Line
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        themeTokens.secondary,
                        const Color(0xFF00CBE8), // Teal
                        const Color(0xFF5D5FEF), // Indigo
                      ],
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(24.0), // p-space-lg
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 32.0),
                        child: Text(
                          'No active session',
                          style: themeTokens.typography.bodyMd.copyWith(
                            color: themeTokens.onSurfaceVariant.withValues(alpha: 0.5),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLiveBadge(DayTraceThemeTokens tokens) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: tokens.secondary.withValues(alpha: 0.1),
        border: Border.all(color: tokens.secondary.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Ping animation
          SizedBox(
            width: 8,
            height: 8,
            child: Stack(
              alignment: Alignment.center,
              children: [
                AnimatedBuilder(
                  animation: _pulseController,
                  builder: (context, child) {
                    return Opacity(
                      opacity: 1.0 - _pulseController.value,
                      child: Transform.scale(
                        scale: 1.0 + (_pulseController.value * 1.5),
                        child: Container(
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: tokens.secondary.withValues(alpha: 0.75),
                          ),
                        ),
                      ),
                    );
                  },
                ),
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: tokens.secondary,
                    boxShadow: [
                      BoxShadow(
                        color: tokens.secondary.withValues(alpha: 0.6),
                        blurRadius: 6,
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            'LIVE FOCUS · DEV · 09:00 – 10:30 AM',
            style: tokens.typography.labelSm.copyWith(
              color: tokens.secondary,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressMeter(DayTraceThemeTokens tokens) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: tokens.surface.withValues(alpha: 0.5),
        border: Border.all(color: tokens.outlineVariant.withValues(alpha: 0.6)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.schedule, size: 16, color: Color(0xFF00CBE8)),
                  const SizedBox(width: 6),
                  Text(
                    '42m elapsed',
                    style: tokens.typography.labelMd.copyWith(
                      color: tokens.onSurface,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              Text(
                '48m left',
                style: tokens.typography.labelMd.copyWith(
                  color: tokens.onSurfaceVariant,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            height: 10,
            width: double.infinity,
            decoration: BoxDecoration(
              color: tokens.outlineVariant.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(5),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: 0.466,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      tokens.secondary,
                      const Color(0xFF00CBE8), // Teal
                      const Color(0xFF5D5FEF), // Indigo
                    ],
                  ),
                  borderRadius: BorderRadius.circular(5),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x6600CBE8),
                      blurRadius: 8,
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '09:00 AM',
                style: tokens.typography.labelSm.copyWith(
                  color: tokens.onSurfaceVariant,
                ),
              ),
              Text(
                '46% complete',
                style: tokens.typography.labelSm.copyWith(
                  color: tokens.secondary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '10:30 AM',
                style: tokens.typography.labelSm.copyWith(
                  color: tokens.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionControls(DayTraceThemeTokens tokens) {
    return Row(
      children: [
        Expanded(
          child: _ActionBtn(
            tokens: tokens,
            icon: Icons.stop,
            label: 'Stop',
            color: Colors.red,
            bgColor: Colors.red.withValues(alpha: 0.1),
            borderColor: Colors.red.withValues(alpha: 0.2),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _ActionBtn(
            tokens: tokens,
            icon: Icons.edit,
            label: 'Edit',
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _ActionBtn(
            tokens: tokens,
            icon: Icons.notes,
            label: 'Note',
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _ActionBtn(
            tokens: tokens,
            icon: Icons.mic,
            label: 'Voice',
          ),
        ),
      ],
    );
  }
}

class _ActionBtn extends StatelessWidget {
  final DayTraceThemeTokens tokens;
  final IconData icon;
  final String label;
  final Color? color;
  final Color? bgColor;
  final Color? borderColor;

  const _ActionBtn({
    required this.tokens,
    required this.icon,
    required this.label,
    this.color,
    this.bgColor,
    this.borderColor,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(12),
        child: Ink(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: bgColor ?? tokens.surface.withValues(alpha: 0.9),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: borderColor ?? tokens.outlineVariant.withValues(alpha: 0.7)),
          ),
          child: Column(
            children: [
              Icon(icon, size: 20, color: color ?? tokens.onSurface),
              const SizedBox(height: 2),
              Text(
                label,
                style: tokens.typography.labelSm.copyWith(
                  color: color ?? tokens.onSurface,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
