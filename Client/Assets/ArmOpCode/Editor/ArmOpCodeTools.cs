using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

namespace SuperDreamArmTools
{
    public class ArmOpCodeTools
    {

        [MenuItem("Arm反汇编工具/测试函数", false, 1)]
        public static void ArmToolTest()
        {
            bool isOk = EditorUtility.DisplayDialog("测试函数", "这里是个测试函数", "ok", "cancel");

            Debug.Log("ArmToolTest isOk = " + isOk);
        }
    }
}

