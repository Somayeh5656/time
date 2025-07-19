const Candle = ({ position, isBlownOut }) => {
  return (
    <group position={position}>
      {/* Candle body */}
      <mesh>
        <cylinderGeometry args={[0.09, 0.09, 0.9, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Flame */}
      {!isBlownOut && (
        <>
          <pointLight position={[0, 0.95, 0]} intensity={2} color="orange" distance={1} />
          <mesh position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial emissive="orange" emissiveIntensity={5} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Candle;