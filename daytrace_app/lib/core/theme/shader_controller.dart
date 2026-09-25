import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'shader_controller.g.dart';

class ShaderProgramCache {
  ui.FragmentProgram? spectralBorder;
  ui.FragmentProgram? auroraNight;
  ui.FragmentProgram? auroraLight;
  
  bool get isLoaded => spectralBorder != null && auroraNight != null && auroraLight != null;
}

@Riverpod(keepAlive: true)
class ShaderController extends _$ShaderController {
  final _cache = ShaderProgramCache();

  @override
  Future<ShaderProgramCache> build() async {
    await _loadShaders();
    return _cache;
  }

  Future<void> _loadShaders() async {
    try {
      _cache.spectralBorder = await ui.FragmentProgram.fromAsset('assets/shaders/spectral_border.frag');
      _cache.auroraNight = await ui.FragmentProgram.fromAsset('assets/shaders/aurora_night.frag');
      _cache.auroraLight = await ui.FragmentProgram.fromAsset('assets/shaders/aurora_light.frag');
    } catch (e) {
      debugPrint('Failed to load shaders: $e');
    }
  }

  ui.FragmentProgram? get currentShader {
    // The shader is chosen based on the theme, which is handled at the widget level, 
    // but we can provide all of them via the cache.
    return _cache.spectralBorder;
  }
}
