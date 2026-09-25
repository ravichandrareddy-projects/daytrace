import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:ui' as ui;
import '../theme/theme_provider.dart';
import '../theme/shader_controller.dart';

class DayTraceAnimatedBackground extends ConsumerStatefulWidget {
  final Widget child;

  const DayTraceAnimatedBackground({super.key, required this.child});

  @override
  ConsumerState<DayTraceAnimatedBackground> createState() => _DayTraceAnimatedBackgroundState();
}

class _DayTraceAnimatedBackgroundState extends ConsumerState<DayTraceAnimatedBackground> with SingleTickerProviderStateMixin {
  late final AnimationController _timeController;
  
  @override
  void initState() {
    super.initState();
    _timeController = AnimationController(
      vsync: this,
      duration: const Duration(days: 9999), // Infinite
    )..forward();
  }

  @override
  void dispose() {
    _timeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final shaderCacheAsync = ref.watch(shaderControllerProvider);
    final themeType = ref.watch(themeProvider);
    final themeTokens = ref.watch(themeProvider.notifier).tokens;

    return shaderCacheAsync.when(
      data: (cache) {
        if (!cache.isLoaded) {
          return Container(color: themeTokens.background, child: widget.child);
        }

        ui.FragmentProgram program;
        switch (themeType) {
          case DayTraceThemeType.light:
            program = cache.spectralBorder!;
            break;
          case DayTraceThemeType.dark:
            program = cache.auroraNight!;
            break;
          case DayTraceThemeType.aurora:
            program = cache.auroraLight!;
            break;
        }

        return AnimatedBuilder(
          animation: _timeController,
          builder: (context, child) {
            return CustomPaint(
              painter: _ShaderPainter(
                program: program,
                time: _timeController.lastElapsedDuration?.inMicroseconds.toDouble() ?? 0.0,
                intensity: 1.0,
              ),
              child: child,
            );
          },
          child: widget.child,
        );
      },
      loading: () => Container(color: themeTokens.background, child: widget.child),
      error: (error, stack) => Container(color: themeTokens.background, child: widget.child),
    );
  }
}

class _ShaderPainter extends CustomPainter {
  final ui.FragmentProgram program;
  final double time;
  final double intensity; // 0.0 to 1.0

  _ShaderPainter({
    required this.program,
    required this.time,
    required this.intensity,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final shader = program.fragmentShader();
    
    // Uniforms in the shader:
    // uniform float u_time;
    // uniform vec2 u_resolution;
    // uniform vec2 u_mouse;
    
    // In Impeller/Skia, uniforms are passed as a contiguous sequence of floats.
    // Float values must be set in the exact order they are declared in the struct/uniform list.
    shader.setFloat(0, time / 1000000.0); // u_time in seconds (index 0)
    shader.setFloat(1, size.width); // u_resolution.x (index 1)
    shader.setFloat(2, size.height); // u_resolution.y (index 2)
    shader.setFloat(3, size.width / 2); // u_mouse.x (index 3)
    shader.setFloat(4, size.height / 2); // u_mouse.y (index 4)
    
    final paint = Paint()
      ..shader = shader
      ..blendMode = BlendMode.srcOver;

    canvas.drawRect(Offset.zero & size, paint);
  }

  @override
  bool shouldRepaint(_ShaderPainter oldDelegate) {
    return oldDelegate.time != time || 
           oldDelegate.program != program ||
           oldDelegate.intensity != intensity;
  }
}
