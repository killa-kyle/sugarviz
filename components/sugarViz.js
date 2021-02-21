import { ExpoWebGLRenderingContext, GLView } from "expo-gl"
import { Renderer } from "expo-three"

import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import * as CANNON from "cannon"
import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  DirectionalLight,
  Scene,
  SpotLight,
  BoxGeometry,
  MeshStandardMaterial,
  PlaneGeometry,
  Mesh,
  Clock,
} from "three"



export default function SugarVizView() {
  //Access Redux Store State
  const scannerState = useSelector((state) => state.scanner)
  let {
    loading,
    hasErrors,
    isScanning,
    scanResult,
    products,
    currentProduct 
  } = scannerState 
  let { product, code, status_verbose:status } = currentProduct
  let sugarCount
  

  useEffect(() => {
    // return () => clearTimeout(timeout);
    console.log(sugarCount + "init")
    sugarCount = product?.nutriments?.sugars_value  
  }, [])


  return (
    <GLView
      style={{
        position: "relative",
        left: 0,
        right: 0,
        // top: 12,
        // position: "fixed",
        backgroundColor: 'black',
        width: "95%",
        borderRadius: "12px",
        overflow: "hidden",
        height: 200,
        // borderWidth: 2,
        // borderColor: 'red',
        // marginBottom: 40,
      }}
      onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl

        let camera
        let renderer
        let scene

        let world
        let physicsMaterial
        let defaultContactMaterial

        function init() {
          try {
            scene = new Scene()
            createCamera()
            createLights()
            createFloor()
            createRenderer()
            createPhysics()

            // show sugar falling
            console.log('init', sugarCount)
            visualizeSugar(sugarCount)

            renderer.setAnimationLoop(() => {
              update()
              render()
            })
          } catch (err) {
            console.log("init error", err)
          }
        }

        /**
         * Lights
         */
        function createLights() {
          const ambientLight = new AmbientLight(0xffffff, 0.7)
          scene.add(ambientLight)

          // const pointLight = new PointLight(0xffffff, 2, 1000, 1)
          // pointLight.position.set(0, 200, 200)
          // scene.add(pointLight)

          const spotLight = new SpotLight(0xffffff, 0.5)
          spotLight.position.set(0, 500, 100)
          spotLight.lookAt(scene.position)
          scene.add(spotLight)

          const directionalLight = new DirectionalLight(0xffffff, 0.2)
          directionalLight.castShadow = true
          directionalLight.shadow.mapSize.set(256, 256)
          directionalLight.shadow.camera.far = 15
          directionalLight.shadow.camera.left = -7
          directionalLight.shadow.camera.top = 7
          directionalLight.shadow.camera.right = 7
          directionalLight.shadow.camera.bottom = -7
          directionalLight.position.set(0, 200, 200)
          directionalLight.lookAt(scene.position)
          scene.add(directionalLight)
        }

        /**
         * Renderer
         */
        function createRenderer() {
          renderer = new Renderer({ gl })
          renderer.setSize(width, height)
        }

        /**
         * Camera
         */
        function createCamera() {
          camera = new PerspectiveCamera(75, width / height, 0.01, 100)
          camera.position.z = 8
          camera.position.y = 5.5
          camera.lookAt(scene.position)
        }

        /**
         * Floor
         */
        function createFloor() {
          const floor = new Mesh(
            new PlaneGeometry(10, 10),
            new MeshStandardMaterial({
              color: "#777777",
              metalness: 0.3,
              roughness: 0.4,
            })
          )
          floor.receiveShadow = true
          floor.rotation.x = -Math.PI * 0.5
          scene.add(floor)
        }

        /**
         * Physics
         */

        function createPhysics() {
          world = new CANNON.World()
          world.gravity.set(0, -9.82, 0)

          // default material
          physicsMaterial = new CANNON.Material("default")
          defaultContactMaterial = new CANNON.ContactMaterial(
            physicsMaterial,
            physicsMaterial,
            {
              friction: 100,
              restitution: 0.3,
              contactEquationStiffness: 1e8,
              contactEquationRelaxation: 3,
              frictionEquationStiffness: 1e8,
              frictionEquationRegularizationTime: 3,
            }
          )
          world.defaultContactMaterial = defaultContactMaterial

          // floor physics
          const floorShape = new CANNON.Plane()
          const floorBody = new CANNON.Body()
          floorBody.mass = 0
          floorBody.addShape(floorShape)
          floorBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(-1, 0, 0),
            Math.PI * 0.5
          )
          world.addBody(floorBody)
        }

        /**
         * Create Sugar Cube
         */

        const objectsToUpdate = []

        function createSugarCube(width, height, depth, position) {
          const geometry = new BoxGeometry(1, 1, 1)
          const material = new MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.4,
          })

          const mesh = new Mesh(geometry, material)

          mesh.scale.set(width, height, depth)
          mesh.castShadow = true
          mesh.position.copy(position)
          scene.add(mesh)

          // Cannon.js body
          const shape = new CANNON.Box(
            new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
          )

          const body = new CANNON.Body({
            mass: 0.001,
            position: new CANNON.Vec3(0, 3, 0),
            shape: shape,
            material: physicsMaterial,
          })
          body.position.copy(position)
          // body.addEventListener("collide", playHitSound)
          world.addBody(body)

          // Save in objects
          objectsToUpdate.push({ mesh, body })
        }
        function visualizeSugar(sugarAmount) {
          //demo sugarAmount = 30
          for (let i = 0; i < sugarAmount; i++) {
            createSugarCube(0.5, 0.5, 0.5, {
              x: Math.random() * (1 - -1) + -1,
              y: 3 + sugarAmount * Math.random(),
              z: 0,
            })
          }
        }

        /**
         * Animate and render scene
         */
        const clock = new Clock()
        let oldElapsedTime = 0

        // updates physics every loop
        function update() {
          const elapsedTime = clock.getElapsedTime()
          const deltaTime = elapsedTime - oldElapsedTime
          oldElapsedTime = elapsedTime

          // Update physics
          world.step(1 / 60, deltaTime, 3)

          for (const object of objectsToUpdate) {
            object.mesh.position.copy(object.body.position) // handles physics positioning
            object.mesh.quaternion.copy(object.body.quaternion) // handles physics rolling
          }
        }
        // renders every loop
        function render() {
          renderer.render(scene, camera)
          gl.endFrameEXP()
        }

        init() // kick off scene
      }}
    />
  )
}
