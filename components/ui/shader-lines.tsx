"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * Animated "shader lines" backdrop — restyled to the FORMAZA11 gold palette.
 * - Loads three via npm (no external CDN).
 * - Respects prefers-reduced-motion (renders a single static frame).
 * - Pauses when scrolled off-screen (IntersectionObserver).
 * - Caps devicePixelRatio for performance.
 */
export function ShaderAnimation({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform vec2 resolution;
        uniform float time;

        float random(float x) { return fract(sin(x) * 1e4); }

        void main(void) {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

          vec2 fMosaicScal = vec2(4.0, 2.0);
          vec2 vScreenSize = vec2(256.0, 256.0);
          uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
          uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

          float t = time * 0.06 + random(uv.x) * 0.4;
          float lineWidth = 0.0008;

          float g0 = 0.0, g1 = 0.0, g2 = 0.0;
          for (int i = 0; i < 5; i++) {
            float fi = float(i);
            float d = length(uv);
            g0 += lineWidth * fi * fi / abs(fract(t - 0.000 + fi * 0.01) - d);
            g1 += lineWidth * fi * fi / abs(fract(t - 0.010 + fi * 0.01) - d);
            g2 += lineWidth * fi * fi / abs(fract(t - 0.020 + fi * 0.01) - d);
          }
          float glow = g0 + g1 + g2;

          // Gold palette (matches FORMAZA11 tokens)
          vec3 deep   = vec3(0.72, 0.52, 0.17);
          vec3 bright = vec3(1.00, 0.90, 0.60);
          vec3 color = mix(deep, bright, clamp(g2, 0.0, 1.0)) * glow;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height, false);
      uniforms.resolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height
      );
      renderer.render(scene, camera);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let rafId: number | null = null;
    let visible = true;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };

    const start = () => {
      if (reduceMotion || rafId !== null) return;
      animate();
    };
    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(container);

    if (!reduceMotion && visible) start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}
