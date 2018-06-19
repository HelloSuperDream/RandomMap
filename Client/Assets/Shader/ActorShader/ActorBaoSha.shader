Shader "Tina_Shader/ActorBaoSha"
{
	Properties
	{
		_MainTex ("Texture", 2D) = "white" {}
		_LightingTex ("Texture", 2D) = "white"{} 
		_PassParam ("PassParam", Vector) = (1, 1, 1, 1)
	}
	SubShader
	{
		LOD 100

		Tags
		{
			"Queue" = "Transparent"
			
			"IgnoreProjector" = "True"
			"RenderType" = "Transparent"
			"CanUseSpriteAtlas"="True"
		}

		Pass 
		{
			blend SrcAlpha OneMinusSrcAlpha
			//ZWrite off
			cull back
			Stencil 
			{
				ref 0
				Comp always
				pass keep
				fail keep
				zfail keep
			}
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			// make fog work
			#pragma multi_compile_fog
			
			#include "UnityCG.cginc"

			struct appdata
			{
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
			};

			struct v2f
			{
				float2 uv : TEXCOORD0;
				UNITY_FOG_COORDS(1)
				float4 vertex : SV_POSITION;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;

			sampler2D _LightingTex;
			float4 _LightingTex_ST;
			
			half4 _PassParam;
			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				UNITY_TRANSFER_FOG(o,o.vertex);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				// sample the texture
				fixed4 col = tex2D(_MainTex, i.uv);
				//col.rgb /= 2;

				col.rgb *= _PassParam.x;

				fixed4 lightingTex = tex2D(_LightingTex, i.uv);

				col.a = 1 - lightingTex;

				col.a *= _PassParam.y;

				// apply fog
				UNITY_APPLY_FOG(i.fogCoord, col);
				return col;
			}
			ENDCG

			
		}

		/*
		Pass
		{
			blend SrcAlpha One
			
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			// make fog work
			//#pragma multi_compile_fog
			
			#include "UnityCG.cginc"

			struct appdata
			{
				float4 vertex : POSITION;
				float2 uv : TEXCOORD0;
			};

			struct v2f
			{
				float2 uv : TEXCOORD0;
				UNITY_FOG_COORDS(1)
				float4 vertex : SV_POSITION;
			};

			sampler2D _MainTex;
			float4 _MainTex_ST;
			
			sampler2D _LightingTex;
			float4 _LightingTex_ST;

			half4 _PassParam;

			v2f vert (appdata v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.uv = TRANSFORM_TEX(v.uv, _MainTex);
				UNITY_TRANSFER_FOG(o,o.vertex);
				return o;
			}
			
			fixed4 frag (v2f i) : SV_Target
			{
				// sample the texture
				fixed4 col = tex2D(_MainTex, i.uv);

				col.rgb *= _PassParam.y;

				fixed4 lightingTex = tex2D(_LightingTex, i.uv);

				col.a = lightingTex.b;
				// apply fog
				UNITY_APPLY_FOG(i.fogCoord, col);
				return col;
			}
			ENDCG
		}
		*/
		
	}
}
